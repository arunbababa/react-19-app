import { NextPage } from 'next';

import BoxContents from '@/components/BoxContents';

const Page: NextPage = () => {
  return (
    <>
      <div className="mx-auto mt-10 max-w-4xl">
        <div className="grid grid-cols-3 gap-4">
          <BoxContents title="arunbababa" discription="hogehogehoge" />
          <BoxContents title="arunbababa" discription="hogehogehoge" />
          <BoxContents title="arunbababa" discription="hogehogehoge" />
        </div>
      </div>
    </>
  );
};

export default Page;
