import { ChangeEvent, useState } from 'react';

import type { UseMemo } from '@/types/UseMemo';

const useMemo = (): UseMemo => {
  const [memo, setMemo] = useState<string>('');
  const [memoList, setMemoList] = useState<string[]>([]);

  const handleMemoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMemo(e.currentTarget.value);
  };

  const handleMemoAdd = () => {
    if (!memo) {
      return;
    }
    setMemoList((prev) => [...prev, memo]);
    setMemo('');
  };

  const handleMemoDelete = (index: number) => {
    setMemoList((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    memo,
    memoList,
    handleMemoAdd,
    handleMemoDelete,
    handleMemoChange,
  };
};

export default useMemo;
