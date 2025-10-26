import { useEffect, useState } from 'react';

import { UseTimer } from '@/types/UseTimer';

const useTimer = (): UseTimer => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout; // ここに置くことでif, else if の２つのブロックで共有して利用できる
    if (isActive) {
      interval = setTimeout(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval); // ちなみにこれは依存配列が変わってuseEffectが再実行される前に毎回必ず走る→一秒ごとにintervalをなくし、新しいものを生成している(なおsetTimeoutの1秒後に走ってからuseEffectは走るのでしっかりと毎回変更される部分はご心配なく)
  }, [time, isActive]);

  const handleClickToggle = () => {
    setIsActive((prev) => !prev);
  };

  const handleClickReset = () => {
    setTime(0);
    setIsActive(false);
  };
  return {
    time,
    isActive,
    handleClickToggle,
    handleClickReset,
  };
};

export default useTimer;
