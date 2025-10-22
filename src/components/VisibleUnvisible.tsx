import React from 'react';

import Button from '@/components/common/parts/Button';
import useVisibleUnvisible from '@/lib/useVisibleUnvisible';

const VisibleUnvisible = (): JSX.Element => {
  const { isVisible, handleClickUnVisible, handleClickVisivle } = useVisibleUnvisible();
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="flex justify-center ">
        <div>
          {isVisible && <h1 className="mb-4 text-6xl">これが表示/非表示になるよ</h1>}
          <div className="flex justify-center gap-4">
            <Button onClick={handleClickVisivle} variant="primary" label="表示" />
            <Button onClick={handleClickUnVisible} variant="primary" label="非表示" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisibleUnvisible;
