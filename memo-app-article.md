# Reactでメモアプリを作るハンズオン ~追加機能と削除機能を学ぼう~

## 前提条件・環境構築

### 必要な知識

- Reactの基本的な知識（コンポーネント、JSX）
- TypeScriptの基礎
- Hooks（`useState`）の基本的な使い方

### 環境構築

この記事では、Next.js + TypeScript + Tailwind CSSの環境を使用します。
環境構築の詳細は以下のコマンドでセットアップできます：

```bash
npx create-next-app@latest memo-app --typescript --tailwind --app
```

または、既存のプロジェクトをお持ちの場合は、以下の依存関係がインストールされていることを確認してください：

- React 18.1.0以上
- TypeScript 5.3.3以上
- Next.js 14.1.0以上

## メモアプリの完成形

今回作成するメモアプリは以下の機能を持ちます：

1. **追加機能**: テキスト入力欄に入力したメモを追加できる
2. **削除機能**: 追加したメモを個別に削除できる

## 全体像の把握：ベタ書きコードと実際の挙動

学習を始める前に、まず完成形のコード全体を見て、どのような挙動をするのかを確認しましょう。

### ベタ書きコード（全体像）

以下は、コンポーネント分割前のベタ書きコードです。全てのロジックが1つのファイルにまとまっています：

```tsx
import { NextPage } from 'next';
import { useState } from 'react';

import Button from '@/components/common/parts/Button';

const Page: NextPage = () => {
  // stateで持つもの
  const [memo, setMemo] = useState<string>('');
  const [memoList, setMemoList] = useState<string[]>([]);

  // 更新関数周り
  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.currentTarget.value);
  };

  const handleMemoAdd = () => {
    if (!memo) {
      return;
    }
    setMemoList((prev) => [...prev, memo]);
    setMemo('');
  };

  const handleMemoDelete = (index: number) => {
    setMemoList((prev) => prev.filter((_, i) => i !== index));
  };

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

export default Page;
```

### 実際の挙動（GIF動画）

![メモアプリの動作デモ](path/to/your/memo-app-demo.gif)

上記のGIF動画では、以下の挙動が確認できます：

1. **追加機能**: 入力欄にテキストを入力し、「追加」ボタンをクリックすると、メモが一覧に追加されます
2. **削除機能**: 各メモの横にある「削除」ボタンをクリックすると、該当するメモが一覧から削除されます
3. **入力欄のクリア**: メモを追加した後、入力欄が自動的に空になる様子

このコードの各部分がどのように動作するのか、以下で詳しく解説していきます。

それでは、一つずつ詳しく見ていきましょう。

## 1. ステート設計と追加機能の実装

### 何をステートで管理すべきか？

Reactでアプリケーションを開発する際、重要なのは「何をステートとして管理すべきか」を判断することです。

メモアプリの場合、以下の2つのステートが必要です：

```tsx
const [memo, setMemo] = useState<string>('');
const [memoList, setMemoList] = useState<string[]>([]);
```

#### 1. `memo`: 現在入力中のテキスト

```tsx
const [memo, setMemo] = useState<string>('');
```

このステートは、**入力フォームの現在の値を保持**します。ユーザーが入力欄に文字を入力すると、このステートが更新され、入力欄と同期します。

#### 2. `memoList`: 追加されたメモの一覧

```tsx
const [memoList, setMemoList] = useState<string[]>([]);
```

このステートは、**これまでに追加された全てのメモ**を配列として保持します。空配列で初期化し、メモが追加されるたびに配列に要素が追加されていきます。

### 入力値をステートと同期させる（制御コンポーネント）

Reactで入力フォームを扱う場合、**制御コンポーネント（Controlled Component）**のパターンを使用します。これにより、Reactが入力値の状態を完全に制御できます。

```tsx
<input
  type="text"
  placeholder="メモを入力"
  value={memo} // ステートの値と同期
  onChange={handleMemoChange} // 入力時にステートを更新
/>
```

`value={memo}` により、入力欄の値は常に `memo` ステートと同期します。

### 入力変更時のハンドラー関数

入力欄の値が変更されるたびに、`handleMemoChange` 関数が呼ばれ、ステートが更新されます：

```tsx
const handleMemoChange = (e: ChangeEvent<HTMLInputElement>) => {
  setMemo(e.currentTarget.value);
};
```

この関数により：

1. ユーザーが入力欄に文字を入力
2. `onChange` イベントが発火
3. `handleMemoChange` が実行され、`setMemo` でステート更新
4. ステート更新によりコンポーネントが再レンダリング
5. 入力欄の表示が更新された値に変更される

### メモ追加機能の実装

メモを追加するには、入力された値を `memoList` に追加する必要があります。

```tsx
const handleMemoAdd = () => {
  if (!memo) {
    return; // 空のメモは追加しない
  }
  setMemoList((prev) => [...prev, memo]);
  setMemo('');
};
```

#### コードの詳細解説

**1. 空文字チェック**

```tsx
if (!memo) {
  return;
}
```

空のメモが追加されないように、事前にチェックします。

**2. 配列への追加（スプレッド構文）**

```tsx
setMemoList((prev) => [...prev, memo]);
```

ここで重要なのは、**関数型更新（Functional Update）**を使用していることです。

- `prev`: 現在の `memoList` の値
- `[...prev, memo]`: スプレッド構文を使って既存の配列を展開し、新しい要素 `memo` を追加

**なぜ関数型更新を使うのか？**

Reactのステート更新は非同期です。関数型更新を使うことで、常に最新の `memoList` の値を参照でき、競合状態を防げます。

**3. 入力欄のクリア**

```tsx
setMemo('');
```

メモを追加した後、入力欄を空に戻します。

### いつ、どのように再レンダリングされるのか？

Reactでは、ステートが更新されると自動的にコンポーネントが再レンダリングされます。

**再レンダリングのタイミング：**

1. `setMemo` が呼ばれる → 入力欄の表示が更新される
2. `setMemoList` が呼ばれる → メモ一覧の表示が更新される（新しいメモが追加される）

**再レンダリングの流れ：**

```
ユーザーが「追加」ボタンをクリック
↓
handleMemoAdd が実行される
↓
setMemoList でステート更新
↓
React が変更を検知
↓
コンポーネントが再レンダリング
↓
新しいメモが画面に表示される
```

## 2. 配列をレンダリングする方法

### メモ一覧の表示：`map` メソッドの使用

追加されたメモを画面上に表示するには、配列の各要素をJSX要素に変換する必要があります。Reactでは、配列の `map` メソッドを使用します。

```tsx
<ul>
  {memoList.map((memoItem, index) => {
    return <li key={index}>{memoItem}</li>;
  })}
</ul>
```

### `map` メソッドの詳細解説

#### 1. `map` の基本構文

```tsx
array.map((要素, インデックス) => {
  return JSX要素;
});
```

- `memoItem`: 配列の各要素（この場合は文字列）
- `index`: 要素のインデックス番号（0, 1, 2...）

#### 2. `key` プロパティの重要性

```tsx
<li key={index}>
```

Reactでは、リストをレンダリングする際に `key` プロパティが必須です。これにより、Reactがどの要素が変更、追加、削除されたかを効率的に判断できます。

**注意**: 実際のプロダクションでは、`index` を `key` に使うのは推奨されません。

##### なぜ `index` を `key` として使うべきでないのか？

要素の順序が変わると、残りの要素のインデックスも全て変わるため、Reactが正しく要素を識別できず、予期しない挙動やパフォーマンスの問題が発生する可能性があります。また、順序が変わることで、意図しないコンポーネントに状態が引き継がれる可能性もあります。

今回は簡潔に説明するため文字列の配列を使用しているため、簡易的に `index` を使用していますが、実際のアプリケーションでは各要素を一意に識別できる値（ID）を `key` として使用することを推奨します。

**詳細な解説については、以下の公式ドキュメントを参照してください：**

- [React公式ドキュメント - Lists and Keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### 3. 削除ボタンの実装

各メモに削除ボタンを追加する場合：

```tsx
<ul>
  {memoList.map((memoItem, index) => {
    return (
      <li key={index} className="mb-3 flex items-center justify-between">
        {memoItem}
        <Button variant="primary" label="削除" onClick={() => handleMemoDelete(index)} />
      </li>
    );
  })}
</ul>
```

### `map` を使わない場合の実装（比較）

`map` を使わない場合、同じことを実現するには以下のようなコードになります：

#### 方法1: `for` ループを使う（非推奨）

```tsx
const items = [];
for (let i = 0; i < memoList.length; i++) {
  items.push(<li key={i}>{memoList[i]}</li>);
}

return <ul>{items}</ul>;
```

この方法は動作しますが、コードが冗長で読みにくくなります。

#### 方法2: `forEach` を使う（非推奨）

```tsx
const items = [];
memoList.forEach((memoItem, index) => {
  items.push(<li key={index}>{memoItem}</li>);
});

return <ul>{items}</ul>;
```

これも動作しますが、`map` の方がシンプルです。

### `map` を使うことでどう簡単になるのか？

1. **コードが簡潔**: 1つのメソッドで配列からJSX要素の配列を生成
2. **宣言的**: 「どのように」ではなく「何を」レンダリングするかを記述
3. **読みやすい**: 意図が明確で、メンテナンスが容易
4. **Reactらしい**: Reactの推奨パターンに沿っている

## 3. 削除機能の実装

### 削除機能のロジック：`filter` メソッド

メモを削除するには、配列から特定の要素を取り除く必要があります。Reactでは、`filter` メソッドを使用します。

```tsx
const handleMemoDelete = (index: number) => {
  setMemoList((prev) => prev.filter((_, i) => i !== index));
};
```

### `filter` メソッドの詳細解説

#### 1. `filter` の基本構文

```tsx
array.filter((要素, インデックス) => {
  return 条件式; // trueを返した要素だけが残る
});
```

`filter` は、条件に一致する要素だけを残した新しい配列を返します。

#### 2. 削除ロジックの動作

```tsx
prev.filter((_, i) => i !== index);
```

- `prev`: 現在の `memoList` の値
- `_`: 配列の要素（今回は使用しないため `_` で無視）
- `i`: 要素のインデックス
- `i !== index`: 削除対象のインデックス以外の要素だけを残す

**具体例：**

削除前の `memoList`: `["メモ1", "メモ2", "メモ3"]`（インデックス: 0, 1, 2）

`index = 1`（"メモ2"を削除）の場合：

```tsx
['メモ1', 'メモ2', 'メモ3'].filter((_, i) => i !== 1);
```

評価：

- `i = 0`: `0 !== 1` → `true` → "メモ1" を残す
- `i = 1`: `1 !== 1` → `false` → "メモ2" を削除
- `i = 2`: `2 !== 1` → `true` → "メモ3" を残す

結果: `["メモ1", "メモ3"]`

#### 3. 関数型更新の重要性

削除機能でも、関数型更新を使用しています：

```tsx
setMemoList((prev) => prev.filter((_, i) => i !== index));
```

これにより、常に最新の `memoList` の値を参照できます。

### 削除ボタンの実装

各メモに削除ボタンを配置し、クリック時に該当するメモを削除します：

```tsx
{
  memoList.map((memoItem, index) => {
    return (
      <li key={index}>
        {memoItem}
        <Button variant="primary" label="削除" onClick={() => handleMemoDelete(index)} />
      </li>
    );
  });
}
```

**重要**: `onClick={() => handleMemoDelete(index)}` のように、アロー関数を使って `index` を渡しています。これにより、各ボタンが正しいインデックスを参照できます。

### 削除時の再レンダリング

削除ボタンをクリックすると：

1. `handleMemoDelete(index)` が実行される
2. `setMemoList` で新しい配列（削除後の配列）をセット
3. Reactがステートの変更を検知
4. コンポーネントが再レンダリング
5. 削除されたメモが画面から消える

## 完全なコード実装

それでは、ここまで学んだ内容を組み合わせて、完全なメモアプリを実装しましょう。

### 型定義（`src/types/UseMemo.ts`）

```ts
type UseMemo = {
  memo: string;
  memoList: string[];
  handleMemoAdd: () => void;
  handleMemoDelete: (index: number) => void;
  handleMemoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type { UseMemo };
```

### ロジック（`src/lib/useMemo.ts`）

```tsx
import { ChangeEvent, useState } from 'react';

import type { UseMemo } from '@/types/UseMemo';

const useMemo = (): UseMemo => {
  const [memo, setMemo] = useState<string>('');
  const [memoList, setMemoList] = useState<string[]>([]);

  const handleMemoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMemo(e.currentTarget.value);
  };

  const handleMemoAdd = () => {
    if (!memo) {
      return;
    }
    setMemoList((prev) => [...prev, memo]);
    setMemo('');
  };

  const handleMemoDelete = (index: number) => {
    setMemoList((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    memo,
    memoList,
    handleMemoAdd,
    handleMemoDelete,
    handleMemoChange,
  };
};

export default useMemo;
```

### UIコンポーネント（`src/components/Memo.tsx`）

```tsx
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
```

### ページコンポーネント（`src/pages/practice/16.tsx`）

```tsx
import { NextPage } from 'next';

import Memo from '@/components/Memo';

const Page: NextPage = () => {
  return <Memo />;
};

export default Page;
```

## まとめ

この記事では、Reactでメモアプリを作成しながら、以下の重要な概念を学びました：

### 追加機能で学んだこと

1. **ステート設計**: 何をステートで管理すべきか（`memo` と `memoList`）
2. **制御コンポーネント**: 入力フォームをステートと同期させる方法
3. **関数型更新**: スプレッド構文を使った配列への要素追加
4. **再レンダリング**: ステート更新による自動的なUI更新
5. **`map` メソッド**: 配列をJSX要素に変換する効率的な方法

### 削除機能で学んだこと

1. **`filter` メソッド**: 配列から特定の要素を取り除く方法
2. **インデックスベースの削除**: インデックスを使って要素を特定
3. **イミュータブルな更新**: 元の配列を変更せず、新しい配列を作成

これらの概念は、ReactでインタラクティブなUIを構築する上で基礎となるものです。ぜひ実際にコードを書いて、動作を確認してみてください！
