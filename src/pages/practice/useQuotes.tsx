import { useEffect, useState } from 'react';

import { UseQuotes } from '@/types/UseQuotes';

const QUOTES = [
  '人生とは、自分を見つけることではない。自分を創ることである。 — ジョージ・バーナード・ショー',
  '今日という日は、残りの人生の最初の日である。 — チャールズ・ディードリッヒ',
  '幸せはなるものではなく、気づくものだ。 — アラン',
  '失敗したことがない人は、何も新しいことをしていない人だ。 — アルベルト・アインシュタイン',
  '夢を追う勇気があるなら、すべての夢は叶えられる。 — ウォルト・ディズニー',
  '行動こそが、恐れを克服する唯一の方法である。 — デール・カーネギー',
  '考えることを止めた瞬間、人は老いる。 — アルベルト・アインシュタイン',
  '教育とは、学校で学んだことをすべて忘れたあとに残るものだ。 — アルベルト・アインシュタイン',
  '人を動かすのは理屈ではなく、感情である。 — デール・カーネギー',
  '過去に学び、未来に夢を見て、今を生きよ。 — アルベルト・アインシュタイン',
];

const useQuotes = (): UseQuotes => {
  const [quote, setQuote] = useState('');
  useEffect(() => {
    const index = Math.floor(Math.random() * 10);
    const selectedQuote = QUOTES[index];
    setQuote(selectedQuote);
  });
  return {
    quote,
  };
};

export default useQuotes;
