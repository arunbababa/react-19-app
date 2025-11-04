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
