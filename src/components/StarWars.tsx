import React from 'react';

import Button from '@/components/common/parts/Button';
import useStarWars from '@/lib/useStarWars';

const StarWars = (): JSX.Element => {
  const { personData, handleSubmit } = useStarWars();
  return (
    <div className="mx-auto mt-5 max-w-5">
      <div className="flex justify-center">
        <div>
          {/* 一旦配列ではないオブジェクトの体で一つずつレンダーする */}
          {personData ? (
            <>
              <p>{personData.name}</p>
              <p>{personData.height}</p>
              <p>{personData.mass}</p>
              <p>{personData.hair_color}</p>
            </>
          ) : (
            <p>loading...</p>
          )}
          <Button label="送信" variant="primary" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default StarWars;
