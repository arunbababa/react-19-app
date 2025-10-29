// 方針
// fetchして返ってくるもの確認
// エンドポイントごとに変化チェックし、それに応じてonclickでランダムにfetchするロジック作成
// ＵＩはよしなに

import { NextPage } from 'next';

import StarWars from '@/components/StarWars';

type PersonData = {
  name: string; // 名前
  height: string; // 身長
  mass: string; // 体重
  hair_color: string; // 髪の色
};

const Page: NextPage = () => {
  return <StarWars />;
};

export default Page;
