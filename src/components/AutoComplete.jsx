import { useState } from 'react';

const AutoComplete = ({ allPokemons, setDisplayedPokemons }) => {
  // App.js에서 가져옴
  const [searchTerm, setSearchTerm] = useState('');

  // 입력된 값에 일치하는 데이터 반환
  const filterNames = (input) => {
    const value = input.toLowerCase();
    return value ? allPokemons.filter((e) => e.name.includes(value)) : [];
  };

  // 검색 버튼 누르면 검색된 데이터 빈칸 제거하고 setDisplayedPokemons를 filterNames 함수를 통해 리턴되는 데이터로 저장
  const handleSubmit = (e) => {
    e.preventDefault();

    let text = searchTerm.trim();
    setDisplayedPokemons(filterNames(text));
    setSearchTerm('');
  };

  const checkEqualName = (input) => {
    const filteredArray = filterNames(input.trim());
    // 해당 input이 속해있는 포켓몬을 담은 배열에서 첫번째 포켓몬의 이름이 input과 같으면 빈 배열 반환
    // 즉 해당 포켓몬 이름을 정확히 입력한 경우 빈 배열을 반환하는 것 아닌 경우는 filteredArray 반환
    return filteredArray[0]?.name === input ? [] : filteredArray;
  };

  return (
    <div className="relative z-50">
      <form
        onSubmit={handleSubmit}
        className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center"
        />
        <button
          type="submit"
          className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700"
        >
          검색
        </button>
      </form>
      {/* checkEqualName을 통해 받아온 배열의 길이가 0보다 클 때만 UI를 보여준다 */}
      {checkEqualName(searchTerm).length > 0 && (
        <div className="w-full flex bottom-0 h-0 flex-col absolute justify-between items-center translate-y-2">
          {/* 삼각형 부분 */}
          <div className="w-0 h-0 bottom-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2"></div>
          <ul className="w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-0 overflow-auto scrollbar-hide">
            {checkEqualName(searchTerm).map((e, i) => (
              <li key={`button-${i}`}>
                <button
                  // 버튼 클릭하면 해당 포켓몬 이름으로 input에 value 값 변경
                  onClick={() => setSearchTerm(e.name)}
                  className="text-base w-full hover:bg-gray-600 p-[2px] text-gray-100"
                >
                  {e.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
