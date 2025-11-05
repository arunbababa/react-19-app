# 【徹底解説】Reactで日記アプリを作成するハンズオン ~useState、useMemo、検索をマスターしよう~

## 読者対象

この記事は、**React初心者から中級者**を対象としています。以下の知識があることを前提としています：

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
npx create-next-app@latest diary-app --typescript --tailwind --app
```

または、既存のプロジェクトをお持ちの場合は、以下の依存関係がインストールされていることを確認してください：

- React 18.1.0以上
- TypeScript 5.3.3以上
- Next.js 14.1.0以上

## 日記アプリの完成形

今回作成する日記アプリは以下の機能を持ちます：

1. **追加機能**: タイトルとコンテンツを入力して日記を追加できる
2. **日付フィルタリング機能**: 日付を選択して特定の日の日記だけを表示できる
3. **日記一覧表示**: 追加した日記を一覧で表示できる

## 全体像の把握：ベタ書きコードと実際の挙動

学習を始める前に、まず完成形のコード全体を見て、どのような挙動をするのかを確認しましょう。

### ベタ書きコード（全体像）

以下は、コンポーネント分割前のベタ書きコードです。全てのロジックが1つのファイルにまとまっています：

```tsx
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
```

### 実際の挙動（GIF動画）

![日記アプリの動作デモ](path/to/your/diary-app-demo.gif)

上記のGIF動画では、以下の挙動が確認できます：

1. **追加機能**: タイトルとコンテンツを入力し、「追加」ボタンをクリックすると、日記が一覧に追加されます
2. **日付フィルタリング機能**: 日付入力欄で日付を選択すると、その日の日記だけが表示されます
3. **日記一覧表示**: 追加した日記が日付、タイトル、コンテンツの順で表示されます

このコードの各部分がどのように動作するのか、以下で詳しく解説していきます。

## 1. ステート設計：何をステートとして管理すべきか？

Reactでアプリケーションを開発する際、最も重要なのは「何をステートとして管理すべきか」を判断することです。日記アプリの場合、以下の4つのステートが必要です：

```tsx
const [title, setTitle] = useState<string>('');
const [content, setContent] = useState<string>('');
const [diaryList, setDiaryList] = useState<Diary[]>([]);
const [filterDate, setFilterDate] = useState<string>('');
```

### 1. `title`: タイトル入力欄の現在の値

```tsx
const [title, setTitle] = useState<string>('');
```

このステートは、**タイトル入力フォームの現在の値を保持**します。ユーザーが入力欄に文字を入力すると、このステートが更新され、入力欄と同期します。

### 2. `content`: コンテンツ入力欄の現在の値

```tsx
const [content, setContent] = useState<string>('');
```

このステートは、**コンテンツ入力フォーム（textarea）の現在の値を保持**します。複数行のテキストを入力できるtextareaと同期します。

### 3. `diaryList`: 追加された日記の一覧（オブジェクト配列）

```tsx
const [diaryList, setDiaryList] = useState<Diary[]>([]);
```

このステートは、**これまでに追加された全ての日記**を配列として保持します。空配列で初期化し、日記が追加されるたびに配列に要素が追加されていきます。

**重要なポイント**: 日記アプリでは、**オブジェクトの配列**を管理します。各日記は以下の情報を持ちます：

```tsx
type Diary = {
  title: string; // タイトル
  content: string; // コンテンツ
  date: string; // 日付（YYYY-MM-DD形式）
};
```

### 4. `filterDate`: フィルタリング用の日付

```tsx
const [filterDate, setFilterDate] = useState<string>('');
```

このステートは、**日付フィルタリング機能で選択された日付**を保持します。空文字列の場合は全ての日記を表示し、日付が選択されている場合はその日の日記だけを表示します。

### なぜオブジェクト配列なのか？

日記アプリでは、単純な文字列の配列ではなく、オブジェクトの配列が必要です。理由は以下の通りです：

1. **複数の情報を管理**: 各日記はタイトル、コンテンツ、日付という複数の情報を持つ
2. **日付によるフィルタリング**: 日付フィールドを使って検索・フィルタリングを行う必要がある
3. **機能の拡張性**: 将来的にタグやカテゴリなどの情報を追加する際に、オブジェクト構造の方が拡張しやすい

## 2. 入力値の管理と日記の追加

### 入力値をステートと同期させる（制御コンポーネント）

Reactで入力フォームを扱う場合、**制御コンポーネント（Controlled Component）**のパターンを使用します。これにより、Reactが入力値の状態を完全に制御できます。

```tsx
<input
  type="text"
  placeholder="タイトルを入力"
  value={title} // ステートの値と同期
  onChange={handleTitleChange} // 入力時にステートを更新
/>
```

`value={title}` により、入力欄の値は常に `title` ステートと同期します。

### 入力変更時のハンドラー関数

入力欄の値が変更されるたびに、ハンドラー関数が呼ばれ、ステートが更新されます：

```tsx
const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setTitle(e.currentTarget.value);
};
```

この関数により：

1. ユーザーが入力欄に文字を入力
2. `onChange` イベントが発火
3. `handleTitleChange` が実行され、`setTitle` でステート更新
4. ステート更新によりコンポーネントが再レンダリング
5. 入力欄の表示が更新された値に変更される

### 日記追加機能の実装

日記を追加するには、入力された値を `diaryList` に追加する必要があります。

```tsx
const handleDiaryAdd = () => {
  if (!title || !content) {
    return; // タイトルまたはコンテンツが空の場合は追加しない
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
```

#### コードの詳細解説

**1. 空文字チェック**

```tsx
if (!title || !content) {
  return;
}
```

タイトルまたはコンテンツが空の日記が追加されないように、事前にチェックします。

**2. 配列への追加（スプレッド構文）**

```tsx
setDiaryList((prev) => [{ title, content, date: currentDate }, ...prev]);
```

ここで重要なのは、**関数型更新（Functional Update）**を使用していることです。

- `prev`: 現在の `diaryList` の値
- `[{ title, content, date: currentDate }, ...prev]`: スプレッド構文を使って既存の配列を展開し、新しい日記オブジェクトを先頭に追加

**なぜ関数型更新を使うのか？**

Reactのステート更新は非同期です。関数型更新を使うことで、常に最新の `diaryList` の値を参照でき、競合状態を防げます。

**3. 入力欄のクリア**

```tsx
setTitle('');
setContent('');
```

日記を追加した後、入力欄を空に戻します。

## 3. 日付のフォーマット処理：詳細解説

日記アプリでは、日付を `YYYY-MM-DD` 形式（例: `2025-11-05`）で保存する必要があります。これは、後述する日付フィルタリング機能で `type="date"` の `<input>` 要素と整合性を保つためです。

### 日付フォーマット処理のコード

```tsx
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const currentDate = `${year}-${month}-${day}`;
```

### 各行の詳細解説

#### 1. `const today = new Date();`

現在の日時を取得します。`new Date()` は現在の日時を表すDateオブジェクトを返します。

**例**: `2025年11月5日 14:30:00` のような日時オブジェクト

#### 2. `const year = today.getFullYear();`

年を4桁の数値として取得します。

**重要なポイント**: `getYear()` ではなく `getFullYear()` を使用します。

- `getYear()`: 非推奨（1900年基準で返すため、2025年だと125が返る）
- `getFullYear()`: 推奨（4桁の年を返すため、2025年だと2025が返る）

**例**: `2025`

#### 3. `const month = String(today.getMonth() + 1).padStart(2, '0');`

月を2桁の文字列として取得します。

**処理の流れ**:

1. `today.getMonth()`: 月を取得しますが、**0から11の数値**を返します（0が1月、11が12月）
2. `+ 1`: 1から12の数値に変換します
3. `String(...)`: 数値を文字列に変換します
4. `.padStart(2, '0')`: 文字列の左側を `0` で埋めて、2桁に統一します

**具体例**:

- 1月の場合: `getMonth()` → `0` → `+ 1` → `1` → `String(1)` → `"1"` → `padStart(2, '0')` → `"01"`
- 11月の場合: `getMonth()` → `10` → `+ 1` → `11` → `String(11)` → `"11"` → `padStart(2, '0')` → `"11"`

**なぜ `padStart` が必要か？**

`type="date"` の `<input>` 要素は、`YYYY-MM-DD` 形式を期待しており、月や日が1桁の場合でも `01` や `05` のように2桁にする必要があります。これにより、日付フィルタリング機能が正しく動作します。

#### 4. `const day = String(today.getDate()).padStart(2, '0');`

日を2桁の文字列として取得します。

**処理の流れ**:

1. `today.getDate()`: 日を取得します（1から31の数値）
2. `String(...)`: 数値を文字列に変換します
3. `.padStart(2, '0')`: 文字列の左側を `0` で埋めて、2桁に統一します

**具体例**:

- 5日の場合: `getDate()` → `5` → `String(5)` → `"5"` → `padStart(2, '0')` → `"05"`
- 15日の場合: `getDate()` → `15` → `String(15)` → `"15"` → `padStart(2, '0')` → `"15"`

#### 5. `const currentDate = \`${year}-${month}-${day}\`;`

テンプレートリテラルを使って、年、月、日を `-` で繋いで `YYYY-MM-DD` 形式の文字列を生成します。

**例**: `"2025-11-05"`

### 実行例

2025年11月5日の場合：

```javascript
const today = new Date(); // 2025-11-05T14:30:00.000Z
const year = today.getFullYear(); // 2025
const month = String(11).padStart(2, '0'); // "11"
const day = String(5).padStart(2, '0'); // "05"
const currentDate = `${year}-${month}-${day}`; // "2025-11-05"
```

### なぜこの形式が必要か？

`type="date"` の `<input>` 要素は、`YYYY-MM-DD` 形式の文字列を期待します。

- ✅ 正しい: `"2025-11-05"`
- ❌ 間違い: `"2025/11/5"` や `"2025年11月5日"`

この形式に統一することで、日記の保存日付とフィルター入力の日付が一致し、フィルタリングが正しく動作します。

## 4. フィルタリング機能とuseMemoの活用

### フィルタリングロジックの実装

日記アプリでは、選択された日付に基づいて日記をフィルタリングする機能があります。

```tsx
const filteredDiaryList = filterDate
  ? diaryList.filter((diary) => diary.date === filterDate)
  : diaryList;
```

#### コードの詳細解説

**1. 条件分岐（三項演算子）**

```tsx
filterDate ? ... : diaryList
```

- `filterDate` が空文字列でない場合: フィルタリングを実行
- `filterDate` が空文字列の場合: 全ての日記を表示

**2. filterメソッドによるフィルタリング**

```tsx
diaryList.filter((diary) => diary.date === filterDate);
```

`filter` メソッドは、条件に一致する要素だけを残した新しい配列を返します。

- `diary.date === filterDate`: 日記の日付が選択された日付と一致するかチェック
- 一致する日記だけが新しい配列に含まれる

**具体例**:

`diaryList`: `[{ title: "日記1", date: "2025-11-05" }, { title: "日記2", date: "2025-11-06" }]`
`filterDate`: `"2025-11-05"`

結果: `[{ title: "日記1", date: "2025-11-05" }]`

### useMemoによる最適化

上記のフィルタリングロジックを `useMemo` で最適化することができます。

```tsx
const filteredDiaryList = useMemo(() => {
  return filterDate ? diaryList.filter((diary) => diary.date === filterDate) : diaryList;
}, [diaryList, filterDate]);
```

#### useMemoとは？

`useMemo` は、**計算結果をメモ化（キャッシュ）する**Reactのフックです。依存配列の値が変わらない限り、前回の計算結果を再利用します。

#### useMemoの構文

```tsx
const memoizedValue = useMemo(() => {
  // 計算処理
  return computedValue;
}, [依存配列]);
```

- **第1引数**: 計算処理を行う関数
- **第2引数（依存配列）**: この配列の値が変わったときだけ再計算する

#### なぜuseMemoを使うのか？

**1. パフォーマンスの最適化**

フィルタリング処理は、`diaryList` が大きい場合に計算コストがかかります。`useMemo` を使うことで、`diaryList` や `filterDate` が変わらない限り、前回の計算結果を再利用できるため、不要な再計算を避けられます。

**2. 再レンダリングの最適化**

`filteredDiaryList` は、子コンポーネントにpropsとして渡される可能性があります。`useMemo` を使うことで、同じ配列参照を維持できるため、子コンポーネントの不要な再レンダリングを防げます。

#### 依存配列の意味

```tsx
[diaryList, filterDate];
```

この依存配列は、以下のことを意味します：

- `diaryList` が変わったとき: フィルタリングを再実行
- `filterDate` が変わったとき: フィルタリングを再実行
- どちらも変わらないとき: 前回の計算結果を再利用

#### useMemoを使わない場合との比較

**useMemoを使わない場合**:

```tsx
const filteredDiaryList = filterDate
  ? diaryList.filter((diary) => diary.date === filterDate)
  : diaryList;
```

毎回のレンダリングでフィルタリング処理が実行されます。`diaryList` や `filterDate` が変わっていなくても、親コンポーネントが再レンダリングされると、毎回新しい配列が作成されます。

**useMemoを使う場合**:

```tsx
const filteredDiaryList = useMemo(() => {
  return filterDate ? diaryList.filter((diary) => diary.date === filterDate) : diaryList;
}, [diaryList, filterDate]);
```

`diaryList` や `filterDate` が変わらない限り、前回の計算結果を再利用するため、パフォーマンスが向上します。

## 5. 配列のレンダリング：mapメソッドの使い方

追加された日記を画面上に表示するには、配列の各要素をJSX要素に変換する必要があります。Reactでは、配列の `map` メソッドを使用します。

```tsx
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
```

### mapメソッドの詳細解説

#### 1. mapの基本構文

```tsx
array.map((要素, インデックス) => {
  return JSX要素;
});
```

- `diary`: 配列の各要素（この場合は `Diary` 型のオブジェクト）
- `index`: 要素のインデックス番号（0, 1, 2...）

#### 2. keyプロパティの重要性

```tsx
<li key={index}>
```

Reactでは、リストをレンダリングする際に `key` プロパティが必須です。これにより、Reactがどの要素が変更、追加、削除されたかを効率的に判断できます。

**注意**: 実際のプロダクションでは、`index` を `key` に使うのは推奨されません（要素の順序が変わる可能性があるため）。今回は簡易的な実装として使用しています。

理想的には、各要素を一意に識別できる値（ID）を `key` として使用します：

```tsx
type Diary = {
  id: string; // 一意のID
  title: string;
  content: string;
  date: string;
};

// 使用例
{
  filteredDiaryList.map((diary) => {
    return <li key={diary.id}>...</li>;
  });
}
```

#### 3. オブジェクトのプロパティへのアクセス

```tsx
{
  diary.date;
}
{
  diary.title;
}
{
  diary.content;
}
```

オブジェクトのプロパティにアクセスするには、ドット記法（`.`）を使用します。

### mapを使うことでどう簡単になるのか？

1. **コードが簡潔**: 1つのメソッドで配列からJSX要素の配列を生成
2. **宣言的**: 「どのように」ではなく「何を」レンダリングするかを記述
3. **読みやすい**: 意図が明確で、メンテナンスが容易
4. **Reactらしい**: Reactの推奨パターンに沿っている

## 6. 検索機能の実装：日付によるフィルタリング

日記アプリでは、日付入力欄で日付を選択することで、その日の日記だけを表示する検索機能を実装しています。

### 検索機能のコード

```tsx
const [filterDate, setFilterDate] = useState<string>('');

const handleFilterDateChange = (e: ChangeEvent<HTMLInputElement>) => {
  setFilterDate(e.currentTarget.value);
};

const filteredDiaryList = useMemo(() => {
  return filterDate ? diaryList.filter((diary) => diary.date === filterDate) : diaryList;
}, [diaryList, filterDate]);
```

### 検索機能の動作

1. **日付の選択**: ユーザーが `type="date"` の `<input>` 要素で日付を選択
2. **ステートの更新**: `handleFilterDateChange` が実行され、`filterDate` ステートが更新される
3. **フィルタリング**: `useMemo` により、`diaryList` から選択された日付と一致する日記だけを抽出
4. **表示の更新**: `filteredDiaryList` が更新され、画面に表示される日記が変わる

### 条件分岐による検索ロジック

```tsx
filterDate ? diaryList.filter((diary) => diary.date === filterDate) : diaryList;
```

この三項演算子は、以下の条件分岐を行います：

- **`filterDate` が空文字列でない場合**: `diaryList.filter(...)` を実行してフィルタリング
- **`filterDate` が空文字列の場合**: 全ての日記を表示（`diaryList` をそのまま使用）

### 検索機能のUI実装

```tsx
<input
  type="date"
  className="rounded-md border border-gray-300 px-4 py-2"
  value={filterDate}
  onChange={handleFilterDateChange}
/>
```

`type="date"` の `<input>` 要素は、ブラウザの日付選択UIを提供します。選択された日付は `YYYY-MM-DD` 形式の文字列として `value` に設定されます。

### 検索の具体例

**例1: 全ての日記を表示**

```tsx
filterDate = '' // 空文字列
→ filteredDiaryList = diaryList // 全ての日記を表示
```

**例2: 特定の日の日記だけを表示**

```tsx
filterDate = '2025-11-05'
diaryList = [
  { title: '日記1', date: '2025-11-05' },
  { title: '日記2', date: '2025-11-06' },
  { title: '日記3', date: '2025-11-05' }
]
→ filteredDiaryList = [
  { title: '日記1', date: '2025-11-05' },
  { title: '日記3', date: '2025-11-05' }
]
```

## 7. コンポーネント分割

実際のプロダクションでは、コードを複数のファイルに分割して管理します。これにより、コードの可読性や保守性が向上します。

### 分割後の構造

以下のように、型定義、ロジック、UIコンポーネントを分離します：

```
src/
  ├── types/
  │   └── UseDiary.ts      # 型定義
  ├── lib/
  │   └── useDiary.ts      # ロジック（カスタムフック）
  ├── components/
  │   └── Diary.tsx        # UIコンポーネント
  └── pages/
      └── practice/
          └── 18.tsx        # ページコンポーネント
```

### 型定義（`src/types/UseDiary.ts`）

```ts
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
```

### ロジック（`src/lib/useDiary.ts`）

```tsx
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
```

### UIコンポーネント（`src/components/Diary.tsx`）

```tsx
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
```

### ページコンポーネント（`src/pages/practice/18.tsx`）

```tsx
import { NextPage } from 'next';

import Diary from '@/components/Diary';

const Page: NextPage = () => {
  return <Diary />;
};

export default Page;
```

### コンポーネント分割のメリット

1. **関心の分離**: UI、ロジック、型定義を分離することで、各ファイルの責任が明確になる
2. **再利用性**: `useDiary` フックは他のコンポーネントでも再利用可能
3. **テストの容易さ**: ロジックとUIを分離することで、それぞれを独立してテストできる
4. **保守性**: 変更が必要な場合、該当するファイルだけを修正すればよい

## 8. React CompilerとuseMemoについて

### React Compilerとは？

React Compilerは、Reactが自動的にメモ化を行う機能です。従来、開発者が手動で `useMemo` や `useCallback` を使用していた最適化を、コンパイラが自動的に行います。

### React Compilerの主な機能

1. **自動メモ化**: コンポーネントや値の計算結果を自動的にメモ化
2. **不要な再レンダリングの防止**: 依存関係を自動的に追跡し、不要な再レンダリングを防ぐ
3. **コードの簡潔化**: 開発者が手動で `useMemo` や `useCallback` を書く必要がなくなる

### React 19でのuseMemoの扱い

React 19では、React Compilerの導入により、多くの場合で `useMemo` や `useCallback` が不要になります。コンパイラが自動的に最適化を行うため、開発者はより簡潔なコードを書くことができます。

React Compilerはコードを解析し、適切な箇所で自動的にメモ化を適用します。これにより、開発者はコードの可読性や保守性を損なうことなく、パフォーマンスの最適化を実現できます。

### useMemoが必要な場合

ただし、特定の状況では、開発者が `useMemo` や `useCallback` を使用してメモ化を明示的に制御する必要が生じる場合もあります。例えば：

- **エフェクトの依存値として使用する場合**: `useEffect` の依存配列に渡す値としてメモ化された値を使用する場合
- **特定の最適化が必要な場合**: コンパイラが最適化できない複雑な計算の場合

### 既存コードとの関係

既存のコードに関しては、既存のメモ化をそのまま維持するか、削除する前に慎重にテストを行うことが推奨されています。新しいコードでは、メモ化をReact Compilerに任せ、詳細な制御が必要な場合にのみ `useMemo` や `useCallback` を使用することが推奨されています。

### 学習目的でのuseMemoの重要性

React Compilerが導入されても、`useMemo` の理解は重要です。理由は以下の通りです：

1. **最適化の仕組みを理解する**: どのような最適化が行われているかを理解することで、より良いコードを書ける
2. **デバッグ**: パフォーマンスの問題が発生した際に、原因を特定しやすくなる
3. **明示的な制御**: 必要に応じて明示的にメモ化を制御できる

### 参考リンク

- [React Compiler公式ドキュメント](https://react.dev/reference/react/compiler)
- [React 19の新機能](https://react.dev/blog/2024/04/25/react-19)

## まとめ

この記事では、Reactで日記アプリを作成しながら、以下の重要な概念を学びました：

### useStateで学んだこと

1. **ステート設計**: 何をステートで管理すべきか（title, content, diaryList, filterDate）
2. **制御コンポーネント**: 入力フォームをステートと同期させる方法
3. **関数型更新**: スプレッド構文を使った配列への要素追加
4. **再レンダリング**: ステート更新による自動的なUI更新

### useMemoで学んだこと

1. **メモ化**: 計算結果をキャッシュしてパフォーマンスを最適化
2. **依存配列**: いつ再計算すべきかを制御
3. **最適化のタイミング**: いつ `useMemo` を使うべきか

### 検索機能で学んだこと

1. **フィルタリング**: `filter` メソッドを使った配列のフィルタリング
2. **条件分岐**: 三項演算子を使った条件に応じた処理
3. **日付のフォーマット**: `YYYY-MM-DD` 形式への変換

これらの概念は、ReactでインタラクティブなUIを構築する上で基礎となるものです。ぜひ実際にコードを書いて、動作を確認してみてください！
