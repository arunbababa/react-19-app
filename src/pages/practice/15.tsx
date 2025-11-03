// 方針
// fetchして返ってくるもの確認
// エンドポイントごとに変化チェックし、それに応じてonclickでランダムにfetchするロジック作成
// ＵＩはよしなに

// 以下の様に分割
// src/types/UsePokemon.ts    >> Pokemonロジックコンポーネントが返す戻り値の型を定義する
// src/lib/usePokemon.ts      >> Pokemonロジックを書く
// src/components/Pokemon.tsx >> PokemonUIを書き、ロジックのimportをし合体する(exportし,15.tsxで利用する)

import { NextPage } from 'next';

import Pokemon from '@/components/Pokemon';

const Page: NextPage = () => {
  return <Pokemon />;
};

export default Page;
