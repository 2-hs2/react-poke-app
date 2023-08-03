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

      // 3. 포켓몬 데이터를 잘 가져왔다면 데이터들을 destructuring 하고 이전 이후 포켓몬 데이터를 받아오는 함수 호출
      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities } =
          pokemonData;
        const nextAndPreviousPokemon = await getNextPreviousPokemon(id);
        console.log(nextAndPreviousPokemon);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getNextPreviousPokemon(id) {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`; // id는 1부터 매겨지는데 데이터는 0부터 시작하기 때문

    const { data: pokemonData } = await axios.get(urlPokemon);
    console.log(pokemonData);

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
