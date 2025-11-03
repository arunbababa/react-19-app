type PokemonSprites = {
  front_default: string;
};

type PokemonType = {
  type: {
    name: string;
    url: string;
  };
};

type Pokemon = {
  sprites: PokemonSprites;
  name: string;
  types: PokemonType[]; // ここもコンソールで見るとtypeだけではなくslotというのもあるのにどうしてこのような型指定ができるのか? TODO
  weight: number;
  height: number;
};

type UsePokemon = {
  searchQuery: string;
  error: boolean;
  pokemon: Pokemon | null;
  handleOnChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchPokemon: () => void;
};

export type { Pokemon, PokemonSprites, PokemonType, UsePokemon };
