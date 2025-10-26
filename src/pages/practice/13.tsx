// ここにべた書きでコーディング

// 以下の様に分割
// src/types/UseTimer.ts    >> TrafficLightsロジックコンポーネントが返す戻り値の型を定義する
// src/lib/useTimer.ts      >> Timerロジックを書く
// src/components/Timer.tsx >> Timerを書き、ロジックのimportをし合体する(exportし,13.tsxで利用する)

// 実装方針
// 秒数をstateに持つ
// 開始ボタンで現在のstateを初期数字として利用し、1秒ごとに+1する処理を開始
// リセットボタンでタイマーを0にする(カウントもストップ)

// データの持ち方

import { NextPage } from 'next';

import Timer from '@/components/Timer';

const Page: NextPage = () => {
  return <Timer />;
};

export default Page;
