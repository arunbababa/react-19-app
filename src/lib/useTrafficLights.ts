import { useEffect, useState } from 'react';

import { UseTrafficLight } from '@/types/UseTrafficLights';
const useTrafficLights = (): UseTrafficLight => {
  const TRAFFIC_LIGHT = { red: 'green', green: 'yellow', yellow: 'red' } as const;
  const [light, setLight] = useState<keyof typeof TRAFFIC_LIGHT>('red');
  useEffect(() => {
    const timerID = setTimeout(() => {
      const nextLight = TRAFFIC_LIGHT[light];
      setLight(nextLight);
    }, 1000);

    return () => {
      clearTimeout(timerID);
    };
  });
  return {
    light,
  };
};

export default useTrafficLights;
