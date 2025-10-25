// ここにべた書きでコーディング

// 以下の様に分割
// src/types/UseQuotes.ts    >> Clockロジックコンポーネントが返す戻り値の型を定義する
// src/lib/useQuotes.tsx     >> Clockロジックを書く
// src/components/Quotes.tsx >> Clockを書き、ロジックのimportをし合体する(exportし,11.tsxで利用する)

// 実装方針
// 名言を配列で保持する
// レンダリングごとにランダムな数値を生成しそれをインデックスとして配列から名言を取ってくる
import { NextPage } from 'next';

import Quotes from '@/components/Quotes';

const Page: NextPage = () => {
  return <Quotes />;
};

export default Page;
