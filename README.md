# 気候変動データ閲覧アプリ

Django REST Framework（API）と React（UI）を使った、気候変動データの可視化アプリです。

## 使用技術

- Django REST Framework（JWT 認証）
- React
- PostgreSQL

## 機能

- 気温データのグラフ表示
- JWT による認証・ログイン/ログアウト

## デプロイ URL

1. **推奨環境（高速・安定）**  
   https://climate-change-app-2.onrender.com/  
   → フロントエンドは Render、バックエンドは Cloud Run にデプロイしています。  
   **基本的にはこの環境をご利用ください。**

2. **代替環境（すべて Render 上で動作）**  
   https://climate-change-app.onrender.com  
   → フロントエンド・バックエンドともに Render でデプロイしています。  
   Cloud Run 版が利用できない場合の **バックアップ環境** としてご利用ください。  
   ※ バックエンドの起動が遅いため、通常は (1) の利用を推奨します。

## テスト用アカウント

| ユーザー名 | メールアドレス    | パスワード    |
| ---------- | ----------------- | ------------- |
| user1      | user1@example.com | dev_user1_123 |

## 気温変化グラフ

![Climate Chart](docs/screenshots/climate-chart.png)
