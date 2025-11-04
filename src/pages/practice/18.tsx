import { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';

import Button from '@/components/common/parts/Button';

type Diary = {
  title: string;
  content: string;
  date: string;
};

const Page: NextPage = () => {
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
    console.log(e.currentTarget.value);
  };

  const filteredDiaryList = filterDate
    ? diaryList.filter((diary) => diary.date === filterDate)
    : diaryList;

  const handleDiaryAdd = () => {
    if (!title || !content) {
      return;
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    console.log(currentDate);
    setDiaryList((prev) => [{ title, content, date: currentDate }, ...prev]);
    setTitle('');
    setContent('');
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="flex justify-center">
        <div>
          {/* 入力フォーム */}
          <div>
            <input
              type="text"
              placeholder="タイトルを入力"
              className="mb-5 w-full rounded-md border border-gray-300 px-4 py-2 text-center"
              value={title}
              onChange={handleTitleChange}
            />
            <textarea
              placeholder="コンテンツを入力"
              className="mb-5 w-full rounded-md border border-gray-300 px-4 py-2 text-center"
              value={content}
              onChange={handleContentChange}
              rows={5}
            />
            <div className="mb-8 flex items-center justify-between">
              <Button variant="primary" label="追加" onClick={handleDiaryAdd} />
              <input
                type="date"
                className="rounded-md border border-gray-300 px-4 py-2"
                value={filterDate}
                onChange={handleFilterDateChange}
              />
            </div>
          </div>

          {/* 日記一覧 */}
          <div>
            <ul>
              {filteredDiaryList.map((diary, index) => {
                return (
                  <li key={index} className="mb-5 rounded-md border p-4">
                    <div className="mb-2 text-sm text-gray-500">{diary.date}</div>
                    <h3 className="mb-2 text-lg font-bold">{diary.title}</h3>
                    <p className="whitespace-pre-wrap">{diary.content}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
