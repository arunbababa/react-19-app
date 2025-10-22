// 持ってくるもの
// text
// feedBackList
// handleTextArea
// handleFeedBackTextArea

import React from 'react';

import Button from '@/components/common/parts/Button';
import useFeedBack from '@/lib/useFeedBack';

const FeesBack = (): JSX.Element => {
  const { text, feedBackList, handleTextArea, handleFeedBackTextArea } = useFeedBack();
  return (
    <div className="mx-auto mt-10 max-w-4">
      <div className="flex justify-center">
        <div>
          <textarea
            value={text}
            onChange={handleTextArea}
            className="mb-10 border-solid"
          ></textarea>
          <div className="flex justify-center">
            <Button className="" onClick={handleFeedBackTextArea} variant="primary" label="送信" />
          </div>
          <ul className="list-inside list-disc text-gray-500">
            {feedBackList.map((feedBack, index) => {
              return <li key={index}>{feedBack}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeesBack;
