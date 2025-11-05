// 以下の様に分割
// src/types/UseDiary.ts    >> Diaryロジックコンポーネントが返す戻り値の型を定義する
// src/lib/useDiary.ts      >> Diaryロジックを書く
// src/components/Diary.tsx >> DiaryUIを書き、ロジックのimportをし合体する(exportし,18.tsxで利用する)

import { NextPage } from 'next';

import Diary from '@/components/Diary';

const Page: NextPage = () => {
  return <Diary />;
};

export default Page;
