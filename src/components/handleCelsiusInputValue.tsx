import React from 'react';

import useSelciusToFahremheit from '@/lib/useSelciusToFahremheit';

const SelciusToFahremheit = (): JSX.Element => {
  const { handleCelsiusInputValue, fahrenheit } = useSelciusToFahremheit();
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="flex justify-center">
        <div>
          <div className="flex items-center gap-4">
            <label htmlFor="celsius">摂氏温度:</label>
            <input id="celsius" type="number" onChange={handleCelsiusInputValue} />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="fahrenheit">華氏温度</label>
            <input id="fahrenheit" type="number" value={fahrenheit} disabled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelciusToFahremheit;
