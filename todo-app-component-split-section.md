## 最後にコンポーネント分割して役割ごとにファイルを分けましょう!!

これまで、全てのロジックを1つのファイルにまとめたベタ書きコードで実装してきました。しかし、実際のアプリケーション開発では、**コードを役割ごとに分割して管理する**ことが重要です。

コンポーネント分割により、以下のメリットが得られます：

1. **保守性の向上**: 各ファイルの役割が明確になり、変更が容易になる
2. **再利用性の向上**: ロジックやUIコンポーネントを他の場所でも使いやすくなる
3. **テストの容易さ**: 各機能を個別にテストできる
4. **可読性の向上**: コードが整理され、理解しやすくなる

それでは、TODOアプリを以下の4つのファイルに分割していきましょう：

1. **型定義ファイル**: データの型を定義
2. **ロジックファイル**: ステート管理とビジネスロジック
3. **UIコンポーネントファイル**: 画面表示のロジック
4. **ページコンポーネントファイル**: ページ全体の構造

### 型定義（`src/types/UseTodo.ts`）

```ts
type Task = {
  label: string;
  completed: boolean;
};

type UseTodo = {
  inputValue: string;
  tasks: Task[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTaskAdd: () => void;
  handleTaskComplete: (index: number) => void;
  handleTaskDelete: (index: number) => void;
};

export type { Task, UseTodo };
```

型定義ファイルでは、アプリケーションで使用するデータの型を定義します。

- `Task`: 個々のタスクを表すオブジェクトの型
- `UseTodo`: カスタムフックが返す値の型定義

### ロジック（`src/lib/useTodo.ts`）

```tsx
import { ChangeEvent, useState } from 'react';

import type { Task, UseTodo } from '@/types/UseTodo';

const useTodo = (): UseTodo => {
  const [inputValue, setInputValue] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const handleTaskAdd = () => {
    if (!inputValue) {
      return;
    }
    setTasks((prev) => [...prev, { label: inputValue, completed: false }]);
    setInputValue('');
  };

  const handleTaskComplete = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((prevTask, i) =>
        i === index ? { ...prevTask, completed: !prevTask.completed } : prevTask,
      ),
    );
  };

  const handleTaskDelete = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return {
    inputValue,
    tasks,
    handleInputChange,
    handleTaskAdd,
    handleTaskComplete,
    handleTaskDelete,
  };
};

export default useTodo;
```

ロジックファイルでは、ステート管理とビジネスロジックを実装します。

- `useState`によるステート管理
- 各イベントハンドラー関数の実装
- カスタムフックとして、必要な値と関数を返す

このファイルは、**UIとは独立したロジック**を担当します。

### UIコンポーネント（`src/components/Todo.tsx`）

```tsx
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
```

UIコンポーネントファイルでは、画面表示のロジックを実装します。

- `useTodo`フックを呼び出してロジックを取得
- JSXのみを記述（ステート管理やロジックは含まない）
- 再利用可能なコンポーネントとして実装

このファイルは、**見た目とユーザーインタラクション**を担当します。

### ページコンポーネント（`src/pages/practice/17.tsx`）

```tsx
// 方針
// タスクの追加、完了、削除機能を実装
// ステート管理とmap、filterメソッドを使った配列操作を学ぶ

// 以下の様に分割
// src/types/UseTodo.ts    >> Todoロジックコンポーネントが返す戻り値の型を定義する
// src/lib/useTodo.ts      >> Todoロジックを書く
// src/components/Todo.tsx >> TodoUIを書き、ロジックのimportをし合体する(exportし,17.tsxで利用する)

import { NextPage } from 'next';

import Todo from '@/components/Todo';

const Page: NextPage = () => {
  return <Todo />;
};

export default Page;
```

ページコンポーネントファイルでは、ページ全体の構造を定義します。

- `Todo`コンポーネントを呼び出すだけのシンプルな構成
- Next.jsのページルーティングに対応
- ページ固有の設定（メタデータなど）を追加する場所

このファイルは、**ページ全体の構造**を担当します。

### ファイル分割のメリット

このようにファイルを分割することで、以下のようなメリットが得られます：

1. **型定義の一元管理**: 型定義を一箇所にまとめることで、型の変更が容易になる
2. **ロジックの再利用**: `useTodo`フックを他のコンポーネントでも使用できる
3. **UIコンポーネントの再利用**: `Todo`コンポーネントを他のページでも使用できる
4. **責任の分離**: 各ファイルが明確な役割を持ち、コードの理解が容易になる

この分割パターンは、Reactアプリケーション開発における標準的なアーキテクチャです。ぜひ実践してみてください！
