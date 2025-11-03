import { useState } from 'react';

import { Quiz } from '@/types/UseQuiz';

const CHOICES = [
  { ライブラリ: true },
  { フレームワーク: false },
  { 言語: false },
  { データベース: false },
];

const useQuiz = (): Quiz => {
  const [userChoice, setUserChoice] = useState('');
  const [isUserChoiceIsAnswer, setIsUserChoiceIsAnswer] = useState<boolean | undefined>(undefined);
  const handleUserChoice = (CHOICE: Record<string, boolean | undefined>) => {
    const userChoiceKeyDetail = Object.keys(CHOICE)[0];
    const isUserChoiceIsAnswer = Object.values(CHOICE)[0];
    setUserChoice(userChoiceKeyDetail);
    setIsUserChoiceIsAnswer(isUserChoiceIsAnswer);
  };

  const [result, setResult] = useState('');
  const handleResult = () => {
    if (isUserChoiceIsAnswer) {
      setResult('正解です!!');
      return;
    }
    setResult('不正解です...');
  };
  return {
    CHOICES,
    handleUserChoice,
    handleResult,
    result,
    userChoice,
  };
};

export default useQuiz;
