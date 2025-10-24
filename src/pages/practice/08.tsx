import { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';

const Page: NextPage = () => {
  const [celsius, setCelsius] = useState(0);

  const handleCelsiusInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setCelsius(parseInt(e.target.value));
  };

  // 直接計算（useEffect不要）
  const fahrenheit = (celsius * 9) / 5 + 32;

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

export default Page;
