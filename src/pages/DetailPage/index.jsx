import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan';
import { GreaterThan } from '../../assets/GreaterThan';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance';
import { Vector } from '../../assets/Vector';
import Type from '../../components/Type';
import BaseStat from '../../components/BaseStat';
import DamageRelations from '../../components/DamageRelations';

function DetailPage() {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `http://pokeapi.co/api/v2/pokemon/`;

  // 2. 함수 호출해서 마운트 시에 데이터 받아오기
  useEffect(() => {
    fetchPokemonData();
  }, []);

  // 1. 포켓몬 데이터 받아오는 함수
  async function fetchPokemonData() {
    const url = `${baseUrl}${pokemonId}`; // 데이터 받아올 url
    try {
      const { data: pokemonData } = await axios.get(url); // const reponse = ... 이렇게 가져와서 response.data 이렇게 데이터를 사용하지 않고 바로 {data} destructuring

      // 3. 포켓몬 데이터를 잘 가져왔다면 데이터들을 destructuring 하고 이전 이후 포켓몬 이름 데이터를 받아오는 함수 호출
      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities } =
          pokemonData;
        const nextAndPreviousPokemon = await getNextPreviousPokemon(id);

        // 8. damage 관계 데이터 가져오기
        const DamageRealtions = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations; // 다른 타입과의 데미지 관계를 리턴
          })
        );

        // 5. 받아온 해당 포켓몬 데이터를 가공
        const formattedPokemonData = {
          id: id,
          name: name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRealtions: DamageRealtions,
          types: types.map((type) => type.type.name),
        };

        // 10. 가공이 다 되면 데이터 넣어주고 로딩 상태 false로 변경
        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false); // 에러인 경우도 해당 페이지에서 로딩이 멈추도록 해줘야 함
    }
  }

  // 6. abilities 데이터를 가공
  const formatPokemonAbilities = (abilities) => {
    // filter 메소드를 통해 인덱스가 1보다 작은 능력까지만 필터링 (그 이후의 능력들은 삭제)
    // map 메소드를 통해 능력 이름에서 -가 들어가는 모든 부분을 띄어쓰기로 변경
    return abilities
      .filter((ability, index) => index <= 1)
      .map((obj) => obj.ability.name.replaceAll('-', ' '));
  };

  // 7. stats 데이터를 가공 -> 인수로 받은 데이터를 구조분해 해줌
  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEP,
    statSPD,
  ]) => [
    { name: 'Hit Points', baseStat: statHP.base_stat },
    { name: 'Attack', baseStat: statATK.base_stat },
    { name: 'Defense', baseStat: statDEP.base_stat },
    { name: 'Special Attack', baseStat: statSATK.base_stat },
    { name: 'Special Defense', baseStat: statSDEP.base_stat },
    { name: 'Speed', baseStat: statSPD.base_stat },
  ];

  // 4. 이전과 이후 포켓몬 이름을 반환하는 함수
  async function getNextPreviousPokemon(id) {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`; // id는 1부터 매겨지는데 데이터는 0부터 시작하기 때문

    const { data: pokemonData } = await axios.get(urlPokemon);

    const nextResponse =
      pokemonData.next && (await axios.get(pokemonData.next)); // 이후 데이터가 있으면 가져오기
    const previousResponse =
      pokemonData.previous && (await axios.get(pokemonData.previous)); // 이전 데이터가 있으면 가져오기

    return {
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name,
    };
  }

  // 9. 로딩 중이면 로딩 중이라 띄우기
  if (isLoading)
    return (
      <div className="absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50">
        <Loading className="w-12 h-12 z-50 animate-spin text-slate-900" />
      </div>
    );

  if (!isLoading && !pokemon) {
    <div>...NOT FOUND</div>;
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;

  return (
    <article className="flex items-center gap-1 flex-col w-full">
      <div
        className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >
        {pokemon.previous && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
            to={`/pokemon/${pokemon.previous}`}
          >
            <LessThan className="w-5 h-8 p-1" />
          </Link>
        )}
        {pokemon.next && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
            to={`/pokemon/${pokemon.next}`}
          >
            <GreaterThan className="w-5 h-8 p-1" />
          </Link>
        )}
        {/* 윗 부분 */}
        <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
          <div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
            <div className="flex items-center gap-1">
              <Link>
                <ArrowLeft className="w-6 h-8 text-zinc-200" />
              </Link>
              <h1 className="text-zinc-200 font-bold text-xl capitalize">
                {pokemon.name}
              </h1>
            </div>
            <div className="text-zinc-200 font-bold text-md">
              #{pokemon.id.toString().padStart(3, '00')}
            </div>
          </div>
          <div className="relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
            <img
              src={img}
              width="100%"
              height="auto"
              loading="lazy"
              alt={pokemon.name}
              className={`object-contain h-full `}
            />
          </div>
        </section>

        {/* 아랫 부분  */}
        <section className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            {/* 포켓몬 타입 */}
            {pokemon.types.map((type) => (
              <Type key={type} type={type} />
            ))}
          </div>

          <h2 className={`text-base font-semibold ${text}`}>정보</h2>
          <div className="flex w-full items-center justify-between max-w-[400px] text-center">
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Vector />
                {pokemon.height}m
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Abilities</h4>
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability}
                  className="text-[0.5rem] text-zinc-100 capitalize"
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>

          <h2 className={`text-base font-semibold ${text}`}>기본 능력치</h2>
          <div className="w-full">
            <table>
              <tbody>
                {pokemon.stats.map((stat) => (
                  <BaseStat
                    key={stat.name}
                    valueStat={stat.baseStat}
                    nameStat={stat.name}
                    type={pokemon.types[0]}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {pokemon.DamageRealtions && (
            <div className="w-10/12">
              <h2 className={`text-base text-center font-semibold ${text}`}>
                {/* 데미지 관계 */}
                <DamageRelations damages={pokemon.DamageRealtions} />
              </h2>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}

export default DetailPage;
