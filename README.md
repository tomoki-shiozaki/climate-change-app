# 気候変動データ閲覧アプリ

Django REST Framework（API）と React（UI）を使った、気候変動データの可視化アプリです。

## 使用技術

- Django REST Framework, React, PostgreSQL
- Cloud Run / Render（デプロイ環境）
- GitHub Actions（定期バッチ処理）

## 機能

- 気温データの時系列グラフ表示
- JWT による認証・ログイン/ログアウト
- OWID 気候データの定期バッチ取得

## デプロイ URL

1. **推奨環境（高速・安定）**  
   https://climate-change-app-2.onrender.com/  
   フロントは Render、バックエンドは Cloud Run にデプロイ済み。

2. **代替環境（Render 上で動作）**  
   https://climate-change-app.onrender.com  
   Cloud Run 版が使えない場合に利用。

## テスト用アカウント

| ユーザー名 | メールアドレス    | パスワード    |
| ---------- | ----------------- | ------------- |
| user1      | user1@example.com | dev_user1_123 |

## 気温変化グラフ

![Climate Chart](docs/screenshots/climate-chart.png)

## ドキュメント

- 詳細なシステム構成、開発構想や設計案などは
  [docs/README.md](docs/README.md) をご覧ください。
- ※本ドキュメントには開発構想や設計案も含むため、実装と完全には一致しない場合があります。
