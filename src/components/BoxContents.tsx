import React from 'react';

type Props = {
  title: string;
  discription: string;
};

const BoxContents = ({ title, discription }: Props): JSX.Element => {
  return (
    <>
      <div className="shadow-2xl">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p>{discription}</p>
      </div>
    </>
  );
};

export default BoxContents;
