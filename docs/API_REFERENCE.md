# 公開API・コンポーネントドキュメント

本ドキュメントは、プロジェクト内で公開されている API ユーティリティ、カスタムフック、UI コンポーネント、および関連する定数・型の使い方をまとめたものです。利用前に、依存する環境変数や外部ライブラリの前提条件を確認してください。

## 環境変数と前提条件
- `NEXT_PUBLIC_API_BASE_URL`: `httpClient` が参照する API のベース URL。
- `NEXT_PUBLIC_UL_SITE_URL`: `Layout` がカノニカル URL を組み立てる際に使用。
- `NEXT_PUBLIC_ENV`: `dev` のときのみ `__log` が標準出力にログを出力。
- 主要依存: Next.js, React, TypeScript, Tailwind CSS, `react-hook-form`, `axios`, `next-head-seo`, `react-icons`。

## API ユーティリティ

### `httpClient`
- 定義: `src/lib/api/apibase.ts`
- 型: `AxiosInstance`
- 説明: 共通の axios クライアント。`NEXT_PUBLIC_API_BASE_URL` をベース URL として利用します。
- 返り値: `axios.create` の返却値。
- 使用例:

```tsx
import { httpClient } from '@/lib/api/apibase';

async function fetchUsers() {
  const res = await httpClient.get('/users');
  return res.data;
}
```

### `CommonHTTPResponse`
- 型定義: `{ status: number; data: any; headers: any; }`
- 用途: axios レスポンスを正規化する際の型ヒントとして利用できます。

### `APIError`
- 定義: `src/lib/api/error.ts`
- コンストラクタ: `new APIError(statusCode: number, data: any)`
- プロパティ: `statusCode`, `data`
- 主な静的メソッド:
  - `getCodeString(e: unknown): string` – `APIError` の場合はステータスコード文字列を返却。
  - `isBadRequest(e: unknown): boolean` – ステータスコード 400 かつ `data.type === 'BadRequest'` を判定。
- 使用例:

```tsx
try {
  await httpClient.post('/login', payload);
} catch (error) {
  if (APIError.isBadRequest(error)) {
    // 入力エラー処理
  }
}
```

## ログユーティリティ

### `__log`
- 定義: `src/lib/common/log.ts`
- 説明: `NEXT_PUBLIC_ENV` が `dev` のときだけ可変長引数を `console.log` に出力。
- 使用例:

```tsx
import { __log } from '@/lib/common/log';

__log('フォーム送信に成功しました', formValues);
```

## 定数データ

- `APP_NAME`, `APP_ROOT_URL`, `APP_DEFAULT_DESCRIPTION`: サイトのメタデータ。`src/lib/data/metaData.ts`。
- `ROUTES`: `TOP`、`SAMPLE01` などのパス定数 (`src/lib/data/routes.ts`)。

使用例:

```tsx
import { ROUTES } from '@/lib/data/routes';

<Link href={ROUTES.TOP}>トップへ戻る</Link>;
```

## カスタムフック

### `useClock`
- 定義: `src/lib/useClock.ts`
- 戻り値: `{ count: Date }`
- 動作: 1 秒ごとに現在時刻を更新。
- 使用例:

```tsx
import useClock from '@/lib/useClock';

const ClockLabel = () => {
  const { count } = useClock();
  return <time suppressHydrationWarning>{count.toLocaleTimeString()}</time>;
};
```

### `useCountApp`
- 戻り値: `{ count: number; onClickCountUp: () => void }`
- 動作: ボタン操作でカウンタをインクリメント。
- 使用例:

```tsx
const CounterButton = () => {
  const { count, onClickCountUp } = useCountApp();
  return <button onClick={onClickCountUp}>現在の値: {count}</button>;
};
```

### `useFeedBack`
- 戻り値: `{ text, feedBackList, handleTextArea, handleFeedBackTextArea }`
- 動作: テキストエリアの値と送信済みフィードバック一覧を管理。
- 使用例:

```tsx
const FeedbackForm = () => {
  const { text, feedBackList, handleTextArea, handleFeedBackTextArea } = useFeedBack();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFeedBackTextArea();
      }}
    >
      <textarea value={text} onChange={handleTextArea} />
      <button type="submit">送信</button>
      <ul>{feedBackList.map((item) => (<li key={item}>{item}</li>))}</ul>
    </form>
  );
};
```

### `useQuiz`
- 戻り値: `{ CHOICES, handleUserChoice, handleResult, result, userChoice }`
- 動作: 単一選択クイズの状態管理。選択肢は日本語ラベルと正誤フラグのペア。
- 使用例:

```tsx
const QuizBoard = () => {
  const { CHOICES, handleUserChoice, handleResult, result } = useQuiz();
  return (
    <div>
      {CHOICES.map((choice) => {
        const label = Object.keys(choice)[0];
        return (
          <button key={label} onClick={() => handleUserChoice(choice)}>
            {label}
          </button>
        );
      })}
      <button onClick={handleResult}>判定</button>
      <p>{result}</p>
    </div>
  );
};
```

### `useQuotes`
- 戻り値: `{ quote: string }`
- 動作: レンダリングのたびに名言リストからランダムで 1 件取得。
- 注意: 依存配列が空でないため毎レンダーで再評価されます。描画抑制が必要な場合は `useMemo` 等でラップしてください。

### `useSelciusToFahremheit`
- 戻り値: `{ handleCelsiusInputValue, fahrenheit }`
- 動作: 入力値 (摂氏) を内部状態に保持し、都度華氏に変換。
- 使用例:

```tsx
const TemperatureConverter = () => {
  const { handleCelsiusInputValue, fahrenheit } = useSelciusToFahremheit();
  return (
    <>
      <input type="number" onChange={handleCelsiusInputValue} />
      <output>{fahrenheit}</output>
    </>
  );
};
```

### `useStarWars`
- 戻り値: `{ personData, handleSubmit }`
- 動作: `swapi.dev` からランダムな人物データを取得。`handleSubmit` 実行で ID をランダム更新し再取得。
- 使用例:

```tsx
const StarWarsProfile = () => {
  const { personData, handleSubmit } = useStarWars();
  return (
    <section>
      <button onClick={handleSubmit}>別のキャラクター</button>
      {personData ? <p>{personData.name}</p> : <p>loading...</p>}
    </section>
  );
};
```

### `useTimer`
- 戻り値: `{ time, isActive, handleClickToggle, handleClickReset }`
- 動作: 1 秒単位のシンプルなストップウォッチ。

### `useTrafficLights`
- 戻り値: `{ light }`
- 動作: 1 秒ごとに `red → green → yellow` と循環。
- 注意: `useEffect` に依存配列が指定されていないため、毎レンダーでタイマーが再作成されます。標準的には `light` を依存配列に含めるか `setInterval` の利用を検討してください。

### `useVisibleUnvisible`
- 戻り値: `{ isVisible, handleClickVisivle, handleClickUnVisible }`
- 動作: 表示/非表示トグル。

## UI コンポーネント

### レイアウト関連

#### `Layout`
- 定義: `src/components/common/Layout.tsx`
- Props:
  - `path`: ページの相対パス (必須)
  - `title`: ページタイトル (必須)
  - `description`, `noindex`, `noTitleTemplate`, `isTopPage`
- 機能: `next-head-seo` によるメタタグ設定と、共通 `Header` / `Footer` 付きレイアウト。
- 使用例:

```tsx
import Layout from '@/components/common/Layout';

const Page = () => (
  <Layout path="/sample" title="サンプル">
    <h1>サンプルページ</h1>
  </Layout>
);
```

#### `Header`
- 機能: ロゴとトップページへのリンクを表示。

#### `Footer`
- 機能: 空のナビゲーション領域を含むフッター。必要に応じてリンクを追加。

#### `Container`
- Props: `maxWidth`, `className`, 任意の `div` 属性。
- 機能: レスポンシブな左右余白を付与。

### 共通パーツ

#### `Button`
- Props:
  - `variant`: `'primary' | 'secondary' | 'error' | 'error-secondary' | 'text'`
  - `label`: 表示テキスト
  - `Icon`: `react-icons` のコンポーネント
  - `loading`: ローディング表示の有無
  - それ以外は標準の `button` 属性
- 機能: variant ごとに Tailwind クラスを切り替え、ローディング中はスピナーと全画面クリック防止レイヤーを表示。
- 使用例:

```tsx
import Button from '@/components/common/parts/Button';

<Button variant="primary" label="保存" onClick={handleSave} loading={isSaving} />;
```

#### `CommonDialog`
- Props: `isOpen`, `handleClose`, `className`, `children`, `canCloseOtherClick`
- 機能: オーバーレイ付きのモーダルダイアログ。背景クリックで閉じる挙動を制御可能。

#### `CommonImage`
- Props: Next.js の `ImageProps` に加え `divProps`。
- 機能: 画像周囲の letter-spacing を 0 にしてギャップを防止。

#### `CommonCheckbox`
- Props: `checked`, `size`, `onClick`, `divProps`
- 機能: `react-icons` を利用したチェックボックス表示。

#### `CommonCheckboxLabel`
- ジェネリック型対応で `react-hook-form` の `control` と `name` を受け取り、クリックで値を反転。

#### `CommonInput`
- Props: `react-hook-form` の `UseControllerProps` と `input` 属性の合成。
- 機能: バリデーションエラー時に枠色・メッセージを表示。

### 機能コンポーネント

#### `BoxContents`
- Props: `title`, `discription`
- 機能: タイトルと説明文をカード風に描画。

#### `Clock`
- 依存: `useClock`
- 表示: 現在時刻 (SSR とクライアント差異を抑えるため `suppressHydrationWarning` を設定)。

#### `CountUp`
- 依存: `useCountApp`
- 表示: カウンタと 1 つの `Button`。

#### `FeesBack`
- 依存: `useFeedBack`
- 表示: テキストエリア、送信ボタン、入力履歴リスト。

#### `SelciusToFahremheit`
- 依存: `useSelciusToFahremheit`
- 表示: 摂氏入力フィールドと計算済み華氏出力。

#### `Quiz`
- 依存: `useQuiz`
- 表示: 選択肢ボタン群と結果表示。

#### `Quotes`
- 依存: `useQuotes`
- 表示: ランダム名言 1 件。

#### `StarWars`
- 依存: `useStarWars`
- 表示: キャラクタープロフィールと再取得ボタン。

#### `Timer`
- 依存: `useTimer`
- 表示: 経過秒数と開始/停止・リセットボタン。

#### `TrafficLights`
- 依存: `useTrafficLights`
- 表示: 現在の信号色を示す 3 つの円。

#### `VisibleUnvisible`
- 依存: `useVisibleUnvisible`
- 表示: テキスト表示のトグル。

#### `todo/Question`
- 機能: TODO アプリ制作要件を表示する静的コンポーネント。

## 型定義

`src/types` ディレクトリには各フックや機能の戻り値・入力を記述した型が定義されています。主なもの:

- `UseClock`, `UseCountUp`, `UseFeedBack`, `Quiz`, `UseQuotes`, `SelciusToFahremheit`, `UseStarWars`, `UseTimer`, `UseTrafficLight`, `UseVisibleUnvisible`
- `CHOICESType`: クイズ選択肢の型。

各フックはこれらの型を返すことを前提にしているため、型定義を参照することでプロパティの補完や取り扱いが明確になります。

## 実装上の注意点
- 一部フック (`useQuotes`, `useTrafficLights`) は `useEffect` の依存配列が未指定のため、描画が頻発するコンポーネントで使用する場合はメモリリークや不要な再計算に注意してください。
- `useStarWars` は外部 API (`https://swapi.dev`) へのアクセスが前提です。ネットワークエラーを呼び出し側で考慮すると安定します。
- `Button` の `loading` を `true` にすると全画面レイヤーが挿入されるため、モーダル等での使用時は意図した動線か確認してください。

## 参考実装の見つけ方
- 本リポジトリの `src/components` 配下の各コンポーネントが、ここで紹介したフック・パーツの使用例になっています。必要に応じて既存実装を参照しながらカスタマイズしてください。

