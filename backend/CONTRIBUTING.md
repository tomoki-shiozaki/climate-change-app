# Contributing Guide

## 開発環境のセットアップ

本プロジェクトでは、依存関係の管理に **pip-tools** を利用しています。  
開発環境と本番環境でインストールするパッケージを分離して管理しています。

### 依存関係ファイルの構成

- `requirements/base.in`  
  本番環境で必要な最低限の依存関係（例: django, djangorestframework など）

- `requirements/dev.in`  
   開発・テストに必要な依存関係。  
   `requirements/base.in` を読み込み (`-r requirements/base.in`)、さらに開発用ライブラリを追加します。

  例:

  ```text
  -r requirements/base.in
  pytest
  pytest-django
  drf-spectacular
  ```

- `requirements/base.txt`  
  `requirements/base.in` を元に `pip-compile` で生成されたロックファイル（本番用）

- `requirements/dev.txt`  
  `requirements/dev.in` を元に生成されたロックファイル（開発用）

## 開発環境の構築

1. 仮想環境を作成して有効化します。

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows は .venv\Scripts\activate

   ```

2. pip-tools をインストールします。

   ```bash
   pip install pip-tools
   ```

3. 開発環境の依存関係を同期します。

   ```bash
   pip-sync requirements/dev.txt
   ```

## 依存関係の更新方法

新しいライブラリを追加したい場合:

1. `requirements/base.in` または `requirements/dev.in` に追記します。

   - 本番にも必要 → `requirements/base.in`
   - 開発専用 → `requirements/dev.in`

2. lock ファイルを更新します。

   ```bash
   pip-compile requirements/base.in
   pip-compile requirements/dev.in
   ```

3. 生成された `requirements/base.txt` / `requirements/dev.txt` をコミットしてください。

これにより、

- 本番環境 →

  ```bash
  pip install -r requirements/base.txt
  ```

- 開発環境 →

  ```bash
  pip-sync requirements/dev.txt
  ```
