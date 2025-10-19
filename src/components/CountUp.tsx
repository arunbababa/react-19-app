import React from 'react';

import Button from '@/components/common/parts/Button';
import useCountApp from '@/lib/useCountApp';

const CountUp = (): JSX.Element => {
  const { count, onClickCountUp } = useCountApp();
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="flex justify-center">
        <div>
          <h2 className="mb-4 text-center text-6xl">{count}</h2>
          <Button onClick={onClickCountUp} variant="secondary" label="カウントアップ" />
        </div>
      </div>
    </div>
  );
};

export default CountUp;
