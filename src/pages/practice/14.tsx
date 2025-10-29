// 方針
// fetchして返ってくるもの確認
// エンドポイントごとに変化チェックし、それに応じてonclickでランダムにfetchするロジック作成
// ＵＩはよしなに

import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import Button from '@/components/common/parts/Button';

type PersonData = {
  name: string; // 名前
  height: string; // 身長
  mass: string; // 体重
  hair_color: string; // 髪の色
};

const Page: NextPage = () => {
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [randomId, setRandomId] = useState(1);

  const handleSubmit = () => {
    setRandomId(() => {
      const randomNum = Math.floor((Math.random() + 1) * 9);
      return randomNum;
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://swapi.dev/api/people/${randomId}/`);
        const result = (await res.json()) as PersonData;
        console.log(result); // テスト

        setPersonData(result);
      } catch (e) {
        console.log(e);
      }
    };
    void fetchData();
  }, [randomId]);
  return (
    <div className="mx-auto mt-5 max-w-5">
      <div className="flex justify-center">
        <div>
          {/* 一旦配列ではないオブジェクトの体で一つずつレンダーする */}
          {personData ? (
            <>
              <p>{personData.name}</p>
              <p>{personData.height}</p>
              <p>{personData.mass}</p>
              <p>{personData.hair_color}</p>
            </>
          ) : (
            <p>loading...</p>
          )}
          <Button label="送信" variant="primary" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Page;
