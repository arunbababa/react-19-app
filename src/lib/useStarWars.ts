import { useEffect, useState } from 'react';

import type { UseStarWars, PersonData } from '@/types/UseStarWars';

const useStarWars = (): UseStarWars => {
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
  return {
    personData,
    handleSubmit,
  };
};

export default useStarWars;
