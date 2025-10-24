// ここにべた書きでコーディング

// 以下の様に分割
// src/types/UseQuiz.ts    >> Quizロジックコンポーネントが返す戻り値の型を定義する
// src/lib/useQuiz.tsx     >> Quizロジックを書く
// src/components/Quiz.tsx >> QuizUIを書き、ロジックのimportをし合体する(exportし,09.tsxで利用する)

import { NextPage } from 'next';

import Quiz from '@/components/Quiz';

const Page: NextPage = () => {
  return <Quiz />;
};

export default Page;
