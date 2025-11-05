type Diary = {
  title: string;
  content: string;
  date: string;
};

type UseDiary = {
  title: string;
  content: string;
  diaryList: Diary[];
  filterDate: string;
  filteredDiaryList: Diary[];
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFilterDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiaryAdd: () => void;
};

export type { Diary, UseDiary };
