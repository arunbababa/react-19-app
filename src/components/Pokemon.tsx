import React from 'react';

import Button from '@/components/common/parts/Button';
import usePokemon from '@/lib/usePokemon';

const Pokemon = (): JSX.Element => {
  const { searchQuery, error, pokemon, handleOnChangeInput, fetchPokemon } = usePokemon();

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="flex justify-center">
        <div>
          {/* 入力フォーム */}
          <div>
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="ポケモンの名前を入力"
                className="mb-5 rounded-md text-center"
                onChange={handleOnChangeInput}
              />
            </div>
            <div className="flex justify-center">
              <Button
                className="text-center"
                type="submit"
                onClick={fetchPokemon}
                value={searchQuery}
                variant="primary"
                label="送信"
              />
            </div>
            <div className="mt-2 min-h-[1.5rem] text-center">
              {error && <p className="text-error">ポケモンが見つかりませんでした</p>}
            </div>
          </div>

          {/* ポケモン情報 */}
          {pokemon && (
            <div className="mt-4 text-center">
              <p>{pokemon.name}</p>
              <div className="flex justify-center">
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              </div>
              <p>{pokemon.types.map((type) => type.type.name).join(', ')}</p>
              <p>{pokemon.weight}</p>
              <p>{pokemon.height}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pokemon;
