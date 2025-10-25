// ここにべた書きでコーディング

// 以下の様に分割
// src/types/UseClock.ts    >> Clockロジックコンポーネントが返す戻り値の型を定義する
// src/lib/useClock.tsx     >> Clockロジックを書く
// src/components/Clock.tsx >> Clockを書き、ロジックのimportをし合体する(exportし,010.tsxで利用する)

// 実装方針
// 一秒ごとに状態を変える→setinterval
// 初回レンダリング時のみsetintervalを実行する→useeffectで依存配列を空にする

import { NextPage } from 'next';

import Clock from '@/components/Clock';

const Page: NextPage = () => {
  return <Clock />;
};

export default Page;
