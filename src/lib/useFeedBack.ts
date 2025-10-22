import { ChangeEvent, useState } from 'react';

import { UseFeedBack } from '@/types/UseFeedBack';

const useFeedBack: UseFeedBack = () => {
  const [feedBackList, setFeedBacklist] = useState<string[]>([]);
  const [text, setText] = useState('');
  const handleFeedBackTextArea = () => {
    setFeedBacklist((prev) => [...prev, text]);
  };
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return {
    text,
    feedBackList,
    handleTextArea,
    handleFeedBackTextArea,
  };
};

export default useFeedBack;
