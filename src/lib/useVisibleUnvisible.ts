import { useState } from 'react';

import { UseVisibleUnvisible } from '@/types/UseVisibleUnvisible';

const useVisibleUnvisible: UseVisibleUnvisible = () => {
  const [isVisible, setIsvisible] = useState(true);
  const handleClickVisivle = () => {
    setIsvisible(true);
  };
  const handleClickUnVisible = () => {
    setIsvisible(false);
  };
  return {
    isVisible,
    handleClickVisivle,
    handleClickUnVisible,
  };
};

export default useVisibleUnvisible;
