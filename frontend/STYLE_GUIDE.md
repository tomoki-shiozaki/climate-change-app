# STYLE_GUIDE

このドキュメントは、React + Tailwind プロジェクトにおけるスタイルの統一ルールをまとめたものです。

---

## 1. フォントと見出しルール

### 見出し（Heading）

| レベル | Tailwind クラス               | 用途                 |
| ------ | ----------------------------- | -------------------- |
| H1     | `text-2xl font-semibold mb-6` | ページトップ見出し   |
| H2     | `text-xl font-semibold mb-4`  | セクション見出し     |
| H3     | `text-lg font-semibold mb-2`  | サブセクション見出し |

**ポイント**

- 文字の太さやサイズは Tailwind のスケールを基本に統一
- `mb-*` で下余白を統一し、セクション間の間隔を揃える
- 文字の中央寄せが必要な場合は `text-center` を追加

### 本文（Body Text）

- デフォルト：`text-base font-normal`
- 行間：`leading-relaxed` を推奨
- 色：`text-gray-800` など、テーマに応じて統一

---

## 2. 余白のルール

- Tailwind のスケールに沿って余白を統一
  - 小さい間隔：`mb-2`, `mt-2`
  - 標準間隔：`mb-4`, `mt-4`
  - 大きめの間隔：`mb-6`, `mt-6`
- ページ単位の左右余白は `main` に `px-4` で管理
- コンポーネント内の余白は要素間隔（`mb-*`）で調整

---

## 3. レイアウト（Flex / Grid）の使い方

### Flex

- 親子関係で縦横に並べたい場合に使用
- 残りスペースを埋めたい要素には `flex-1` を付与
- 主軸方向の揃え方：
  - `justify-start` / `justify-center` / `justify-end` / `justify-between` / `justify-around` / `justify-evenly`
- 交差軸方向の揃え方：
  - `items-start` / `items-center` / `items-end` / `items-stretch` / `items-baseline`
- 複数行に折り返す場合：
  - `flex-wrap` / `flex-nowrap`
- 例：ページ全体を縦方向に並べ、マップ部分を残りの高さに広げる

```tsx
<div className="flex flex-col h-full">
  <header>...</header>
  <div className="flex-1">
    <CO2WorldMap />
  </div>
</div>
```

横方向に並べる例（ボタン群など）：

```tsx
<div className="flex flex-row items-center justify-between gap-4">
  <button>前へ</button>
  <button>再生</button>
  <button>次へ</button>
</div>
```

縦方向に中央寄せしたい場合：

```tsx
<div className="flex flex-col justify-center items-center h-64 bg-gray-100">
  <p className="text-lg">中央のテキスト</p>
</div>
```

### Grid

カードやアイテムを均等に並べたい場合に使用

例：3 カラムのグリッド

```tsx
<div className="grid grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

### 位置決め（Position）のルール

- Tailwind では `relative`, `absolute`, `fixed`, `sticky` が使用可能
- 基本ルール：
  - 絶対配置 (`absolute`) の子要素がある場合は、**必ず親に `relative` を付与**
  - `relative` は親の基準位置を決めるため、見た目には影響しないが子要素の配置に必須

### UI コンポーネントの配置・装飾ルール（例：年スライダー）

#### 親要素

- 絶対配置の子要素がある場合は `relative` を付与

#### 横中央配置

- `left-1/2` + `-translate-x-1/2` で中央揃え

#### 縦位置

- `top-*` または `bottom-*` の Tailwind スケールで指定（例：`bottom-16`）

#### 重なり順

- 必要に応じて `z-*` で調整（例：`z-[1000]`）

#### Flex レイアウト

- 子要素を横並びにする場合は `flex items-center gap-*` を使用

#### 装飾

- 背景：テーマに沿って `bg-white/90` のように透明度も統一
- 角丸：`rounded-md` / `rounded-lg` などスケールで統一
- 余白：`px-*` / `py-*` で統一
- 影：`shadow-sm`, `shadow-md`, `shadow-lg` で統一

#### コード例

```tsx
<div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 shadow-md">
  <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100">
    再生
  </button>
  <input type="range" className="w-80" />
  <span className="font-semibold">2024</span>
</div>
```

### サイズ指定（Width / Height）のルール

- Tailwind では `w-full`（横幅を親に合わせる）と `h-full`（高さを親に合わせる）が使用可能
- 基本ルール：
  - 親のサイズに合わせて子要素を伸ばしたい場合のみ付与
  - 不要な場合は付けない（Tailwind 最小限原則に従う）
- 例：

<div className="w-full h-64 bg-gray-200">
  <div className="h-full bg-blue-200">親の高さに合わせる</div>
</div>

#### 例

```tsx
<div className="relative w-full h-64 bg-gray-200">
  <button className="absolute bottom-2 right-2 px-2 py-1 bg-blue-500 text-white">
    クリック
  </button>
</div>
```

## 4. コンポーネントの self-contained ルール

- 装飾系クラス（色・角丸・影・文字サイズ）はコンポーネント内で完結する
- レイアウト系クラス（flex, w-full, max-w, px, py）は親に依存する場合がある
- 親に依存する場合はドキュメントで明示し、再利用時に注意する

---

## 5. Tailwind クラスの最小限原則

- 不要なクラスは付けない
- 重複する余白や幅は削除する
- 必要になったら追加する
- 例：div の w-full は、block 要素なら不要

---

## 6. レスポンシブ対応

- 基本はモバイルファースト
- Tailwind のブレークポイントを活用
  - sm: 小画面（640px）以上
  - md: 中画面（768px）以上
  - lg: 大画面（1024px）以上
- 例：sm:text-xl md:text-2xl のように画面幅ごとに調整

---

## 7. コード例の記法

- クラスは意味ごとに改行して書くと可読性が向上する
- 例：見出しの場合

  h1 要素に次のようにクラスを付与するイメージ

  - text-2xl
  - font-semibold
  - mb-6
  - text-center

  → 上記を組み合わせて見出しを作る

---

## 8. まとめ

- フォントサイズ・太さ・余白は統一する
- Flex / Grid は必要な部分だけ使用する
- コンポーネントは self-contained を意識する
- 不要なクラスは付けない
- 親依存のレイアウトは明示する
