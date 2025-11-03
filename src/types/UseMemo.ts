type UseMemo = {
  memo: string;
  memoList: string[];
  handleMemoAdd: () => void;
  handleMemoDelete: (index: number) => void;
  handleMemoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type { UseMemo };
