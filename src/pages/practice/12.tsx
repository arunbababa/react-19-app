// ここにべた書きでコーディング

// 以下の様に分割
// src/types/UseTrafficLights.ts    >> TrafficLightsロジックコンポーネントが返す戻り値の型を定義する
// src/lib/useTrafficLights.ts      >> TrafficLightsロジックを書く
// src/components/TrafficLights.tsx >> TrafficLightsを書き、ロジックのimportをし合体する(exportし,12.tsxで利用する)

// 実装方針
// 3つの要素を１秒ごとに巡回し、バックグランドカラーを変える
// 初回レンダリング時に一度だけsetIntervalで上の処理を実行する関数を実行する

// データの持ち方
// 信号機としての色 → [緑, 黄色, 赤]
// 対象のインデックス → 信号機色の配列の長さを取得し、それを1ずつ増やし、足していっている数字 % 長さ で巡回させる

import { NextPage } from 'next';

import TrafficLights from '@/components/TrafficLights';

const Page: NextPage = () => {
  return <TrafficLights />;
};

export default Page;
