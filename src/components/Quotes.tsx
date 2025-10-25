import React from 'react';

import useQuotes from '@/lib/useQuotes';

const Quotes = (): JSX.Element => {
  const { quote } = useQuotes();
  return (
    <div className="mx-auto mt-5 max-w-4xl">
      <div className="flex justify-center">
        <div>
          <h1>{quote}</h1>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
