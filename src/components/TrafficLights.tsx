import React from 'react';

import useTrafficLights from '@/lib/useTrafficLights';

const TrafficLights = (): JSX.Element => {
  const { light } = useTrafficLights();
  return (
    <div className="mx-auto mt-5 max-w-4xl">
      <div className="flex justify-center">
        <div>
          <div className="flex justify-center gap-5">
            <div
              className={`size-10 rounded-full ${light === 'red' ? 'bg-red-500' : 'bg-gray-500'}`}
            ></div>
            <div
              className={`size-10 rounded-full ${light === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'}`}
            ></div>
            <div
              className={`size-10 rounded-full ${light === 'green' ? 'bg-green-500' : 'bg-gray-500'}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficLights;
