import React from 'react';

import Button from '@/components/common/parts/Button';
import useMemo from '@/lib/useMemo';

const Memo = (): JSX.Element => {
  const { memo, memoList, handleMemoAdd, handleMemoDelete, handleMemoChange } = useMemo();

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="flex justify-center">
        <div>
          <div>
            {/* 入力フォーム */}
            <input
              type="text"
              placeholder="メモを入力"
              className="mb-5 rounded-md border-solid text-center"
              value={memo}
              onChange={handleMemoChange}
            />
            <Button variant="primary" label="追加" onClick={handleMemoAdd} />
          </div>

          {/* メモ一覧 */}
          <div>
            <ul>
              {memoList.map((memoItem, index) => {
                return (
                  <li key={index} className="mb-3 flex items-center justify-between">
                    {memoItem}
                    <Button
                      variant="primary"
                      label="削除"
                      onClick={() => handleMemoDelete(index)}
                    />
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

export default Memo;
