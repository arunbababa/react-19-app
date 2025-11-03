import { ChangeEvent, useState } from 'react';

import type { Pokemon, UsePokemon } from '@/types/UsePokemon';

const usePokemon = (): UsePokemon => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  const handleOnChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const fetchPokemon = async () => {
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLocaleLowerCase()}`,
      );
      const data = (await res.json()) as Pokemon; // これ本来はもっと多くのプロパティで返るのに、これでなぜ動くのか? TODO
      setPokemon(data);
      setError(false);
    } catch {
      setError(true);
      setPokemon(null);
    }
  };

  return {
    searchQuery,
    error,
    pokemon,
    handleOnChangeInput,
    fetchPokemon,
  };
};

export default usePokemon;
