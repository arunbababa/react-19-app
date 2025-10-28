import { useEffect, useState } from 'react';

import { UseTimer } from '@/types/UseTimer';

const useTimer = (): UseTimer => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

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
