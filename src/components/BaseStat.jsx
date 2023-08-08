import { useEffect, useRef } from 'react';

const BaseStat = ({ valueStat, nameStat, type }) => {
  const bg = `bg-${type}`;

  // useRef를 이용해서 요소에 접근하기 (querySelector 같은 느낌)
  const ref = useRef(null); // 업데이트 되더라도 자동으로 리렌더링 되지 않는다
  // useEffect 이용하여 해당 요소(실제 능력치 값 비율을 나타내는 바)의 width 값을 조정
  useEffect(() => {
    const setValueStat = ref.current;
    const calc = valueStat * (100 / 255);
    setValueStat.style.width = calc + '%';
  }, []);

  return (
    <tr className="w-full text-white">
      <td className="sm:px-5">{nameStat}</td>
      <td className="px-2 sm:px-3">{valueStat}</td>
      <td>
        <div
          className={`flex items-start h-2 min-w-[10rem] bg-gray-600 rounded overflow-hidden`}
        >
          <div ref={ref} className={`h-3 ${bg}`}></div>
        </div>
      </td>
      <td className="px-2 sm:px-5">255</td>
    </tr>
  );
};

export default BaseStat;
