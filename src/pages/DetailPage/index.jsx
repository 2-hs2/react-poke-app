import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DetailPage() {
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
        console.log(stats);
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
        };
      }
    } catch (error) {
      console.error(error);
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

  return <div>DetailPage</div>;
}

export default DetailPage;
