import { useEffect, useState } from 'react';
import Type from './Type';

const DamageRelations = ({ damages }) => {
  // 가공된 damageRelations 데이터를 가지는 state
  const [damagePokemonForm, setDamagePokemonForm] = useState({});
  console.log(damagePokemonForm);
  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      separateObjectBetweenToAndFrom(damage)
    );

    // 타입이 두 개인 경우와 한 개인 경우의 처리를 나눔
    if (arrayDamage.length == 2) {
      const obj = joinDamageRelations(arrayDamage); // 두 데이터를 우선 합침
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from))); // 중복된 데이터 처리
    } else {
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }
  }, []);

  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, 'to'),
      from: joinObjects(props, 'from'),
    };
  };

  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: '4x',
      half_damage: '1/4x',
      no_damage: '0x',
    };

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;
      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);

      return (acc = { [keyName]: verifiedValue, ...acc });
    }, {});
  };

  const filterForUniqueValues = (valueForFiltering, damageValue) => {
    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;

      const filterAcc = acc.filter((a) => a.name != name);

      return filterAcc.length === acc.length
        ? (acc = [currentValue, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...filterAcc]);
    }, []);
  };

  const joinObjects = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];
    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]) => {
        const result = firstArrayValue[keyName].concat(value);
        return (acc = { [keyName]: result, ...acc });
      },
      {}
    );
    return result;
  };

  const postDamageValue = (props) => {
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;

      const valuesOfKeyName = {
        double_damage: '2x',
        half_damage: '1/2x',
        no_damage: '0x',
      };

      return (acc = {
        [keyName]: value.map((i) => ({
          damageValue: valuesOfKeyName[key],
          ...i,
        })),
        ...acc,
      });
    }, {});

    return result;
  };

  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations('_from', damage);
    const to = filterDamageRelations('_to', damage);
    return { from, to };
  };

  const filterDamageRelations = (valueFilter, damage) => {
    const result = Object.entries(damage)
      .filter(([keyName, value]) => {
        return keyName.includes(valueFilter); // keyName에서 valueFilter가 있는 애들만 필터링
      })
      .reduce((acc, [keyName, value]) => {
        const keyWithValueFilterRemove = keyName.replace(valueFilter, ''); // keyName에서 valueFilter 제거
        return (acc = { [keyWithValueFilterRemove]: value, ...acc }); // 처음에 빈 배열이지만 from, to에 따라 acc에 채워짐
      }, {});
    return result;
  };

  return (
    <div className="flex gap-2 flex-col">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([keyName, value]) => {
            const key = keyName;
            const valuesOfKeyName = {
              double_damage: 'Weak',
              half_damage: 'Resistant',
              no_damage: 'Immune',
            };

            return (
              <div key={key}>
                <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                  {valuesOfKeyName[key]}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => {
                      return (
                        <Type type={name} key={url} damageValue={damageValue} />
                      );
                    })
                  ) : (
                    <Type type={'none'} key={'none'} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;
