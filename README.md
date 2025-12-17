# 気候変動データ閲覧アプリ

[![Build Status](https://github.com/tomoki-shiozaki/climate-change-app/actions/workflows/ci.yml/badge.svg)](https://github.com/tomoki-shiozaki/climate-change-app/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/tomoki-shiozaki/climate-change-app/graph/badge.svg?token=UH6D9YYQXM)](https://codecov.io/gh/tomoki-shiozaki/climate-change-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Django REST Framework（API）と React（UI）を使った、気候変動データの可視化アプリです。

## 使用技術

- Django REST Framework, React, PostgreSQL
- Cloud Run / Render（デプロイ環境）
- GitHub Actions（定期バッチ処理）

## 機能

- 気温データの時系列グラフ表示
- 国別 CO₂ 排出量の色分けマップ表示（年度スライダー対応）
- JWT による認証・ログイン/ログアウト
- OWID 気候データの定期バッチ取得

## デプロイ URL

1. **推奨環境**  
   https://climate-change-app-2.onrender.com/  
   フロントは Render、バックエンドは Cloud Run にデプロイ済み。
   ※Cloud Run はコールドスタート時に起動時間がかかる場合があります（目安：約 20〜25 秒）。

2. **代替環境（Render 上で動作）**  
   https://climate-change-app.onrender.com  
   Cloud Run 版が使えない場合に利用。
   ※Render（無料プラン）はスリープ復帰に時間がかかる場合があります（目安：約 50〜60 秒）。

## テスト用アカウント

| ユーザー名 | メールアドレス    | パスワード    |
| ---------- | ----------------- | ------------- |
| user1      | user1@example.com | dev_user1_123 |

## 気温変化グラフ

![Temperature Chart](docs/screenshots/temperature-chart-v2.png)

## CO₂ 排出量マップ（年度スライダー）

年度スライダーを動かすことで、各国の色分けが変化します。（自動再生機能あり）

![co2-map-demo](./docs/images/co2-map-demo.gif)

## ドキュメント

- 詳細なシステム構成、開発構想や設計案などは
  [docs/README.md](docs/README.md) をご覧ください。
- ※本ドキュメントには開発構想や設計案も含むため、実装と完全には一致しない場合があります。
