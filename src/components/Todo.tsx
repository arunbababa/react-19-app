import React from 'react';

import Button from '@/components/common/parts/Button';
import useTodo from '@/lib/useTodo';

const Todo = (): JSX.Element => {
  const {
    inputValue,
    tasks,
    handleInputChange,
    handleTaskAdd,
    handleTaskComplete,
    handleTaskDelete,
  } = useTodo();

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="flex justify-center">
        <div>
          {/* 入力フォーム */}
          <div>
            <input
              type="text"
              placeholder="タスクを入力"
              className="mb-5 rounded-md border-solid text-center"
              value={inputValue}
              onChange={handleInputChange}
            />
            <Button variant="primary" label="追加" onClick={handleTaskAdd} />
          </div>

          {/* タスク一覧 */}
          <div>
            <ul>
              {tasks.map((task, index) => {
                return (
                  <li key={index} className="mb-3 flex items-center justify-between">
                    <span className={task.completed ? 'text-gray-500 line-through' : ''}>
                      {task.label}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        label={task.completed ? '未完了' : '完了'}
                        onClick={() => handleTaskComplete(index)}
                      />
                      <Button
                        variant="primary"
                        label="削除"
                        onClick={() => handleTaskDelete(index)}
                      />
                    </div>
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

export default Todo;
