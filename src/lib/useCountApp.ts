import { useState } from 'react';

import { UseCountUp } from '@/types/UseCountUp';

const useCountApp: UseCountUp = () => {
  const [count, setCountUp] = useState(0);
  const onClickCountUp = () => {
    setCountUp((prev) => prev + 1);
  };

  return {
    count,
    onClickCountUp,
  };
};

export default useCountApp;
