import React from 'react';

import Button from '@/components/common/parts/Button';
import useTimer from '@/lib/useTimer';

const Timer = () => {
  const { time, isActive, handleClickReset, handleClickToggle } = useTimer();
  return (
    <div className="mx-auto mt-5 max-w-5xl">
      <div className="flex justify-center gap-5">
        <div>
          <div className="flex justify-center">
            <p>時間: {time}</p>
          </div>
          <div className="flex justify-center gap-5">
            <Button
              onClick={handleClickToggle}
              variant="primary"
              label={isActive ? '停止' : '開始'}
            />
            <Button onClick={handleClickReset} variant="secondary" label="リセット" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
