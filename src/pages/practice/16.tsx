// 方針
// fetchして返ってくるもの確認
// エンドポイントごとに変化チェックし、それに応じてonclickでランダムにfetchするロジック作成
// ＵＩはよしなに

// 以下の様に分割
// src/types/UseMemo.ts    >> Memoロジックコンポーネントが返す戻り値の型を定義する
// src/lib/useMemo.ts      >> Memoロジックを書く
// src/components/Memo.tsx >> MemoUIを書き、ロジックのimportをし合体する(exportし,16.tsxで利用する)

import { NextPage } from 'next';

import Memo from '@/components/Memo';

const Page: NextPage = () => {
  return <Memo />;
};

export default Page;
