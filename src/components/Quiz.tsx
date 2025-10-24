import React from 'react';

import Button from '@/components/common/parts/Button';
import useQuiz from '@/lib/useQuiz';

const Quiz = (): JSX.Element => {
  const { CHOICES, handleUserChoice, handleResult, result, userChoice } = useQuiz();
  return (
    <div className="mx-auto my-5 max-w-4xl">
      <div className="flex justify-center">
        <div>
          <h1 className="text-center">Reactはどのようなものですか?</h1>
          <div className="mb-3 flex justify-center gap-3">
            {CHOICES.map((CHOICE) => {
              const keyOrLabel = Object.keys(CHOICE)[0];
              return (
                <Button
                  key={keyOrLabel}
                  label={keyOrLabel}
                  variant="secondary"
                  onClick={() => handleUserChoice(CHOICE)}
                  className={`bg-${Object.keys(CHOICE)[0] === userChoice && 'black'}`}
                />
              );
            })}
          </div>
          <div className="flex justify-center">
            <Button label="送信" variant="primary" onClick={handleResult} />
          </div>
          <div className="text-center">
            <h2>結果</h2>
            <h1>{result}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
