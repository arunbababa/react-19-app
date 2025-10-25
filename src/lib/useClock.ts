import { useEffect, useState } from 'react';

import { UseClock } from '@/types/UseClock';

const useClock = (): UseClock => {
  const [count, setCount] = useState(new Date());
  useEffect(() => {
    const countID = setInterval(() => {
      setCount(new Date());
    }, 1000);

    return () => {
      clearInterval(countID);
    };
  }, []);
  return {
    count,
  };
};

export default useClock;
