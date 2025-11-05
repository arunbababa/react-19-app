import React from 'react';

import Button from '@/components/common/parts/Button';
import useDiary from '@/lib/useDiary';

const Diary = (): JSX.Element => {
  const {
    title,
    content,
    filterDate,
    filteredDiaryList,
    handleTitleChange,
    handleContentChange,
    handleFilterDateChange,
    handleDiaryAdd,
  } = useDiary();

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

export default Diary;
