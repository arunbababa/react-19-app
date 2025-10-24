import { ChangeEvent, useState } from 'react';

import { SelciusToFahremheit } from '@/types/UseSelciusToFahremheit';

const useSelciusToFahremheit = (): SelciusToFahremheit => {
  const [celsius, setCelsius] = useState(0);

  const handleCelsiusInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setCelsius(parseInt(e.target.value));
  };

  // 直接計算（useEffect不要）
  const fahrenheit = (celsius * 9) / 5 + 32;
  return {
    handleCelsiusInputValue,
    fahrenheit,
  };
};

export default useSelciusToFahremheit;
