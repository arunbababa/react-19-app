# ReactでTODOアプリを作るハンズオン ~追加・完了・削除機能を学ぼう~

## 読者対象

この記事は、**React初心者**を対象としています。以下の知識があることを前提としています：

- Reactの基本的な知識（コンポーネント、JSX）
- TypeScriptの基礎
- Hooks（`useState`）の基本的な使い方
- 配列の`map`メソッドの基本的な理解

## 前提条件・環境構築

### 必要な知識

- Reactの基本的な知識（コンポーネント、JSX）
- TypeScriptの基礎
- Hooks（`useState`）の基本的な使い方
- 配列の`map`メソッドの基本的な理解

### 環境構築

この記事では、Next.js + TypeScript + Tailwind CSSの環境を使用します。
環境構築の詳細は以下のコマンドでセットアップできます：

```bash
npx create-next-app@latest todo-app --typescript --tailwind --app
```

または、既存のプロジェクトをお持ちの場合は、以下の依存関係がインストールされていることを確認してください：

- React 18.1.0以上
- TypeScript 5.3.3以上
- Next.js 14.1.0以上

## TODOアプリの完成形

今回作成するTODOアプリは以下の機能を持ちます：

1. **追加機能**: テキスト入力欄に入力したタスクを追加できる
2. **完了機能**: 追加したタスクを完了状態にできる（完了済みのタスクは未完了に戻せる）
3. **削除機能**: 追加したタスクを個別に削除できる

## 全体像の把握：ベタ書きコードと実際の挙動

学習を始める前に、まず完成形のコード全体を見て、どのような挙動をするのかを確認しましょう。

### ベタ書きコード（全体像）

以下は、コンポーネント分割前のベタ書きコードです。全てのロジックが1つのファイルにまとまっています：

```tsx
import { NextPage } from 'next';
import { useState } from 'react';

import Button from '@/components/common/parts/Button';

type Task = {
  label: string;
  completed: boolean;
};

const Page: NextPage = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

export default Page;
```

### 実際の挙動（GIF動画）

![TODOアプリの動作デモ](path/to/your/todo-app-demo.gif)

上記のGIF動画では、以下の挙動が確認できます：

1. **追加機能**: 入力欄にテキストを入力し、「追加」ボタンをクリックすると、タスクが一覧に追加されます
2. **完了機能**: 各タスクの横にある「完了」ボタンをクリックすると、タスクが完了状態になり、打ち消し線とグレー表示が適用されます。完了済みのタスクでは「未完了」ボタンが表示され、クリックすると未完了状態に戻ります
3. **削除機能**: 各タスクの横にある「削除」ボタンをクリックすると、該当するタスクが一覧から削除されます

このコードの各部分がどのように動作するのか、以下で詳しく解説していきます。

## 1. ステート設計：何をステートとして管理すべきか？

Reactでアプリケーションを開発する際、最も重要なのは「何をステートとして管理すべきか」を判断することです。TODOアプリの場合、以下の2つのステートが必要です：

```tsx
const [inputValue, setInputValue] = useState<string>('');
const [tasks, setTasks] = useState<Task[]>([]);
```

### 1. `inputValue`: 現在入力中のテキスト

```tsx
const [inputValue, setInputValue] = useState<string>('');
```

このステートは、**入力フォームの現在の値を保持**します。ユーザーが入力欄に文字を入力すると、このステートが更新され、入力欄と同期します。

### 2. `tasks`: 追加されたタスクの一覧（オブジェクト配列）

```tsx
const [tasks, setTasks] = useState<Task[]>([]);
```

このステートは、**これまでに追加された全てのタスク**を配列として保持します。空配列で初期化し、タスクが追加されるたびに配列に要素が追加されていきます。

**重要なポイント**: メモアプリと異なり、TODOアプリでは**オブジェクトの配列**を管理します。各タスクは以下の情報を持ちます：

```tsx
type Task = {
  label: string; // タスクのテキスト
  completed: boolean; // 完了状態（true: 完了済み、false: 未完了）
};
```

### なぜオブジェクト配列なのか？

TODOアプリでは、単純な文字列の配列ではなく、オブジェクトの配列が必要です。理由は以下の通りです：

1. **完了状態の管理**: 各タスクが完了しているかどうかを追跡する必要がある
2. **視覚的なフィードバック**: 完了済みのタスクは打ち消し線やグレー表示で区別する必要がある
3. **機能の拡張性**: 将来的に優先度や期限などの情報を追加する際に、オブジェクト構造の方が拡張しやすい

## 2. 入力値の管理とタスクの追加

### 入力値をステートと同期させる（制御コンポーネント）

Reactで入力フォームを扱う場合、**制御コンポーネント（Controlled Component）**のパターンを使用します。

```tsx
<input
  type="text"
  placeholder="タスクを入力"
  value={inputValue} // ステートの値と同期
  onChange={handleInputChange} // 入力時にステートを更新
/>
```

`value={inputValue}` により、入力欄の値は常に `inputValue` ステートと同期します。

### 入力変更時のハンドラー関数

```tsx
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setInputValue(e.currentTarget.value);
};
```

この関数により、ユーザーが入力欄に文字を入力するたびに、`inputValue` ステートが更新されます。

### タスク追加機能の実装

タスクを追加するには、入力された値を `tasks` 配列に追加する必要があります。

```tsx
const handleTaskAdd = () => {
  if (!inputValue) {
    return; // 空のタスクは追加しない
  }
  setTasks((prev) => [...prev, { label: inputValue, completed: false }]);
  setInputValue('');
};
```

#### コードの詳細解説

**1. 空文字チェック**

```tsx
if (!inputValue) {
  return;
}
```

空のタスクが追加されないように、事前にチェックします。

**2. オブジェクト配列への追加**

```tsx
setTasks((prev) => [...prev, { label: inputValue, completed: false }]);
```

ここで重要なのは、**オブジェクトを配列に追加**していることです。

- `prev`: 現在の `tasks` 配列
- `[...prev, { label: inputValue, completed: false }]`: スプレッド構文で既存の配列を展開し、新しいタスクオブジェクトを追加
- `{ label: inputValue, completed: false }`: 新しいタスクオブジェクト。`completed` は `false` で初期化（未完了状態）

**3. 入力欄のクリア**

```tsx
setInputValue('');
```

タスクを追加した後、入力欄を空に戻します。

## 3. 完了機能の実装：`map`メソッドでオブジェクトを更新

### 完了機能のロジック

タスクを完了状態にするには、配列内の特定のオブジェクトの `completed` プロパティを更新する必要があります。Reactでは、`map` メソッドを使用します。

```tsx
const handleTaskComplete = (index: number) => {
  setTasks((prevTasks) =>
    prevTasks.map((prevTask, i) =>
      i === index ? { ...prevTask, completed: !prevTask.completed } : prevTask,
    ),
  );
};
```

### `map`メソッドによるオブジェクト更新の詳細解説

#### 1. `map` の基本構文（オブジェクト配列の場合）

```tsx
array.map((要素, インデックス) => {
  return 新しい要素; // オブジェクトを返す
});
```

- `prevTask`: 配列の各要素（この場合は `Task` オブジェクト）
- `i`: 要素のインデックス番号（0, 1, 2...）

#### 2. 条件分岐による更新

```tsx
i === index ? { ...prevTask, completed: !prevTask.completed } : prevTask;
```

この部分は**三項演算子**を使用して、以下のロジックを実現しています：

- `i === index`: 更新対象のタスクかどうかを判定
- `{ ...prevTask, completed: !prevTask.completed }`: 更新対象の場合、スプレッド構文で既存のオブジェクトを展開し、`completed` プロパティだけを反転（`!prevTask.completed`）
- `prevTask`: 更新対象でない場合、元のオブジェクトをそのまま返す

#### 3. スプレッド構文によるオブジェクトの部分更新

```tsx
{ ...prevTask, completed: !prevTask.completed }
```

スプレッド構文 `...prevTask` により、既存のオブジェクトの全プロパティを展開し、その後で `completed` プロパティを上書きします。これにより、**イミュータブル（不変）な更新**が実現されます。

**具体例：**

更新前の `tasks`:

```tsx
[
  { label: 'タスク1', completed: false },
  { label: 'タスク2', completed: false },
  { label: 'タスク3', completed: false },
];
```

`index = 1`（"タスク2"を完了）の場合：

```tsx
prevTasks.map((prevTask, i) =>
  i === 1 ? { ...prevTask, completed: !prevTask.completed } : prevTask,
);
```

評価：

- `i = 0`: `0 === 1` → `false` → `{ label: 'タスク1', completed: false }` を返す
- `i = 1`: `1 === 1` → `true` → `{ ...{ label: 'タスク2', completed: false }, completed: true }` → `{ label: 'タスク2', completed: true }` を返す
- `i = 2`: `2 === 1` → `false` → `{ label: 'タスク3', completed: false }` を返す

結果:

```tsx
[
  { label: 'タスク1', completed: false },
  { label: 'タスク2', completed: true }, // completedがtrueに変更
  { label: 'タスク3', completed: false },
];
```

#### 4. トグル機能（完了⇔未完了）

`!prevTask.completed` により、`completed` の値を反転（トグル）しています：

- `completed: false` → `!false` → `true`（完了状態にする）
- `completed: true` → `!true` → `false`（未完了状態に戻す）

これにより、完了ボタンを押すたびに完了状態と未完了状態が切り替わります。

## 4. 削除機能の実装：`filter`メソッドで要素を除外

### 削除機能のロジック

タスクを削除するには、配列から特定の要素を取り除く必要があります。Reactでは、`filter` メソッドを使用します。

```tsx
const handleTaskDelete = (index: number) => {
  setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
};
```

### `filter`メソッドの詳細解説

#### 1. `filter` の基本構文

```tsx
array.filter((要素, インデックス) => {
  return 条件式; // trueを返した要素だけが残る
});
```

`filter` は、条件に一致する要素だけを残した新しい配列を返します。

#### 2. 削除ロジックの動作

```tsx
prevTasks.filter((_, i) => i !== index);
```

- `prevTasks`: 現在の `tasks` 配列
- `_`: 配列の要素（今回は使用しないため `_` で無視）
- `i`: 要素のインデックス
- `i !== index`: 削除対象のインデックス以外の要素だけを残す

**具体例：**

削除前の `tasks`:

```tsx
[
  { label: 'タスク1', completed: false },
  { label: 'タスク2', completed: true },
  { label: 'タスク3', completed: false },
];
```

`index = 1`（"タスク2"を削除）の場合：

```tsx
prevTasks.filter((_, i) => i !== 1);
```

評価：

- `i = 0`: `0 !== 1` → `true` → "タスク1" を残す
- `i = 1`: `1 !== 1` → `false` → "タスク2" を削除
- `i = 2`: `2 !== 1` → `true` → "タスク3" を残す

結果:

```tsx
[
  { label: 'タスク1', completed: false },
  { label: 'タスク3', completed: false },
];
```

## 5. ステートとスタイリングの組み合わせ：三項演算子の活用

TODOアプリの特徴的な部分は、**ステートに基づいてUIの見た目を動的に変更する**ことです。これは、三項演算子を使って実現します。

### タスクラベルのスタイリング

```tsx
<span className={task.completed ? 'text-gray-500 line-through' : ''}>{task.label}</span>
```

#### 三項演算子による条件付きスタイリング

```tsx
task.completed ? 'text-gray-500 line-through' : '';
```

- `task.completed`: タスクの完了状態をチェック
- `true` の場合: `'text-gray-500 line-through'` を適用（グレー表示 + 打ち消し線）
- `false` の場合: 空文字列（スタイルなし）

これにより、完了済みのタスクは視覚的に区別されます。

### ボタンラベルの動的変更

```tsx
<Button
  variant="secondary"
  label={task.completed ? '未完了' : '完了'}
  onClick={() => handleTaskComplete(index)}
/>
```

#### 三項演算子によるラベルの切り替え

```tsx
task.completed ? '未完了' : '完了';
```

- `task.completed` が `true` の場合: 「未完了」ボタンを表示
- `task.completed` が `false` の場合: 「完了」ボタンを表示

これにより、タスクの状態に応じてボタンのラベルが自動的に切り替わります。

### ステートとスタイリングの組み合わせ方の考え方

このパターンは、Reactでよく使用される重要な考え方です：

1. **ステートに基づく条件分岐**: ステートの値に応じて、UIの見た目や動作を変更する
2. **三項演算子の活用**: シンプルな条件分岐には三項演算子が適している
3. **一貫性の維持**: ステートが変更されると、自動的にUIも更新される

**メリット：**

- **宣言的**: 「どのように」ではなく「何を」表示するかを記述
- **自動同期**: ステートが更新されると、自動的にUIも更新される
- **保守性**: ステートとUIの関係が明確で、変更が容易

## 6. 配列のレンダリング：`map`メソッドでオブジェクト配列を表示

### タスク一覧の表示

追加されたタスクを画面上に表示するには、配列の各要素（オブジェクト）をJSX要素に変換する必要があります。

```tsx
<ul>
  {tasks.map((task, index) => {
    return (
      <li key={index} className="mb-3 flex items-center justify-between">
        <span className={task.completed ? 'text-gray-500 line-through' : ''}>{task.label}</span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            label={task.completed ? '未完了' : '完了'}
            onClick={() => handleTaskComplete(index)}
          />
          <Button variant="primary" label="削除" onClick={() => handleTaskDelete(index)} />
        </div>
      </li>
    );
  })}
</ul>
```

### `map`メソッドとオブジェクト配列

#### 1. オブジェクト配列の`map`

```tsx
tasks.map((task, index) => {
  return JSX要素;
});
```

- `task`: 配列の各要素（この場合は `Task` オブジェクト）
- `index`: 要素のインデックス番号

#### 2. オブジェクトのプロパティへのアクセス

```tsx
{
  task.label;
} // オブジェクトのlabelプロパティを表示
```

オブジェクト配列の場合、各要素はオブジェクトなので、`task.label` のようにプロパティにアクセスします。

#### 3. ボタンへのインデックス渡し

```tsx
onClick={() => handleTaskComplete(index)}
onClick={() => handleTaskDelete(index)}
```

各ボタンに、`map` で取得した `index` を渡すことで、どのタスクに対する操作かを識別します。

**⚠️ 重要: `index` を `key` として使用することについて**

この記事のコード例では、簡易的な実装として `key={index}` を使用していますが、**実際のプロダクションでは推奨されません**。

##### なぜ `index` を `key` として使うべきでないのか？

要素の順序が変わると、残りの要素のインデックスも全て変わるため、Reactが正しく要素を識別できず、予期しない挙動やパフォーマンスの問題が発生する可能性があります。また、順序が変わることで、意図しないコンポーネントに状態が引き継がれる可能性もあります。

今回は簡潔に説明するため文字列の配列を使用しているため、簡易的に `index` を使用していますが、実際のアプリケーションでは各要素を一意に識別できる値（ID）を `key` として使用することを推奨します。

**詳細な解説については、以下の公式ドキュメントを参照してください：**

- [React公式ドキュメント - Lists and Keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

## まとめ

この記事では、ReactでTODOアプリを作成しながら、以下の重要な概念を学びました：

### ステート設計で学んだこと

1. **何をステートとして管理すべきか**: 入力値とタスク一覧の2つを管理
2. **オブジェクト配列の管理**: 単純な配列ではなく、オブジェクトの配列を管理することで、より複雑な状態を表現できる
3. **型定義の重要性**: TypeScriptで型を定義することで、データ構造を明確にし、バグを防ぐ

### 配列操作で学んだこと

1. **`map`メソッドによる更新**: 配列内の特定のオブジェクトのプロパティを更新する方法
2. **スプレッド構文**: オブジェクトの部分更新をイミュータブルに実現する方法
3. **`filter`メソッドによる削除**: 配列から特定の要素を取り除く方法
4. **関数型更新**: 常に最新のステートを参照するためのパターン

### ステートとUIの連携で学んだこと

1. **三項演算子による条件付きスタイリング**: ステートに基づいてUIの見た目を動的に変更する方法
2. **動的なラベル変更**: ステートに応じてボタンのラベルを切り替える方法
3. **宣言的なUI**: ステートが変更されると自動的にUIも更新される仕組み

これらの概念は、ReactでインタラクティブなUIを構築する上で基礎となるものです。ぜひ実際にコードを書いて、動作を確認してみてください！
