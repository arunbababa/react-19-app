import { ChangeEvent, useMemo, useState } from 'react';

import type { Diary, UseDiary } from '@/types/UseDiary';

const useDiary = (): UseDiary => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [diaryList, setDiaryList] = useState<Diary[]>([]);
  const [filterDate, setFilterDate] = useState<string>('');

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };

  const handleFilterDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.currentTarget.value);
  };

  const filteredDiaryList = useMemo(() => {
    return filterDate ? diaryList.filter((diary) => diary.date === filterDate) : diaryList;
  }, [diaryList, filterDate]);

  const handleDiaryAdd = () => {
    if (!title || !content) {
      return;
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    setDiaryList((prev) => [{ title, content, date: currentDate }, ...prev]);
    setTitle('');
    setContent('');
  };

  return {
    title,
    content,
    diaryList,
    filterDate,
    filteredDiaryList,
    handleTitleChange,
    handleContentChange,
    handleFilterDateChange,
    handleDiaryAdd,
  };
};

export default useDiary;
