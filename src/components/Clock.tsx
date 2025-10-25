import React from 'react';

import useClock from '@/lib/useClock';

const Clock = () => {
  const { count } = useClock();
  return (
    <div className="mx-auto mt-5 max-w-4xl">
      <div className="flex justify-center">
        <div>
          <p suppressHydrationWarning>{count.toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Clock;
