# ==============================
# Variables
# ==============================
VENV = .venv/bin/python

# ==============================
# Python / Django
# ==============================

# 依存関係インストール
install-backend:
	cd backend && pip install -r requirements/dev.txt

# 開発サーバー起動
run-backend:
	cd backend && $(VENV) manage.py runserver

# Django backend のテストを実行
# --cov=apps          : apps/ ディレクトリ以下のコードのカバレッジを測定
# --cov-report=term-missing : ターミナルにカバレッジ結果を出力し、さらに "どの行が未カバーか" を表示する
test-backend:
	cd backend && $(VENV) -m pytest --cov=apps --cov-report=term-missing

# ============================
# OpenAPI Schema Generation
# ============================

generate-schema-yaml:
	cd backend && DEBUG=False GENERATE_SCHEMA=True $(VENV) manage.py spectacular --file schema.yml
	@echo "✅ Generated OpenAPI schema: backend/schema.yml"

generate-schema-json:
	cd backend && DEBUG=False GENERATE_SCHEMA=True $(VENV) manage.py spectacular --format openapi-json --file schema.json
	@echo "✅ Generated OpenAPI schema: backend/schema.json"

generate-schema: generate-schema-yaml generate-schema-json
	@echo "✅ All OpenAPI schemas generated."

# ==============================
# Docker / Backend
# ==============================

# 開発環境の起動・停止
# ------------------------------

# バックグラウンドで起動（Dockerfileの変更は無視）
up:
	docker compose up -d

# イメージを再ビルドして起動（Dockerfile変更時に使う）
build-up:
	docker compose up -d --build

# 完全にキャッシュ無視で再ビルド
rebuild:
	docker compose build --no-cache
	docker compose up -d

# コンテナ停止・削除
down:
	docker compose down

# イメージ・ボリュームも含めて完全削除（最終手段）
clean:
	docker compose down --rmi all --volumes --remove-orphans

# ==============================
# Docker / Backend (v2)
# 別環境（環境変数 切替）用
# ==============================

up-v2:
	ENV_FILE=backend/.env.docker.v2 \
	docker compose up -d

down-v2:
	ENV_FILE=backend/.env.docker.v2 \
	docker compose down

migrate-v2:
	ENV_FILE=backend/.env.docker.v2 \
	docker compose exec backend python manage.py migrate

shell-v2:
	ENV_FILE=backend/.env.docker.v2 \
	docker compose exec backend bash

# ==============================
# その他便利コマンド
# ==============================

# コンテナ内での操作
# Django シェルに入る
shell:
	docker compose exec backend bash

# Django マイグレーションを実行
migrate:
	docker compose exec backend python manage.py migrate

# スーパーユーザー作成（対話式）
createsuperuser:
	docker compose exec backend python manage.py createsuperuser

# ログ確認
# バックエンドのログをリアルタイムで表示
logs-backend:
	docker compose logs -f backend

# DB のログ確認
logs-db:
	docker compose logs -f db

# 任意のコマンドを一時コンテナで実行
# 例: make run cmd="python manage.py test"
run:
	docker compose run --rm backend $(cmd)

# ==============================
# Docker イメージ再ビルド
# ==============================
# バックエンドのイメージをビルド
build-backend:
	docker compose build backend

# キャッシュを無視して完全に再ビルド
rebuild-backend:
	docker compose build --no-cache backend

# =========================================
# Docker クリーンアップ系
# =========================================

# 安全に使えるメイン
# ビルドキャッシュのみ削除
builder-prune:
	@echo "🧹 Dockerビルドキャッシュを削除します（安全）"
	docker builder prune -f

# 停止中のコンテナとdanglingイメージを削除
system-prune:
	@echo "⚠️ 停止中コンテナとタグなしイメージを削除します（安全）"
	docker system prune -f

# 強力、注意して使う
# 停止中コンテナ・未使用イメージ・未使用ボリューム・ネットワークをまとめて削除
full-prune:
	@echo "💥 すべての未使用コンテナ・イメージ・ボリュームを削除します（注意）"
	docker system prune -a --volumes -f

# その他
docker-test-backend:
	docker compose run --rm backend pytest --cov=apps --cov-report=term-missing

docker-shell:
	docker compose run --rm backend python manage.py shell

# ============================
# Docker 上で OpenAPI schema を生成
# ============================

# Docker コンテナ上で新規に schema.json を生成
docker-generate-schema:
	docker compose run --rm \
	  -e DJANGO_ENV=production \
	  -e DEBUG=False \
	  -e GENERATE_SCHEMA=True \
	  backend \
	  python manage.py spectacular --format openapi-json --file schema.json
	@echo "✅ Generated OpenAPI schema.json in Docker container"

# Docker コンテナ上で既存の backend コンテナに対して schema.json を生成
docker-generate-schema-exec:
	docker compose exec \
	  -e DJANGO_ENV=production \
	  -e DEBUG=False \
	  -e GENERATE_SCHEMA=True \
	  backend \
	  python manage.py spectacular --format openapi-json --file schema.json
	@echo "✅ Generated OpenAPI schema.json in running Docker container"

# ==============================
# 開発補助
# ==============================

# UID/GID を自動で .env に書き込む（初回セットアップ用）
setup-env:
	echo "UID=$$(id -u)" > .env
	echo "GID=$$(id -g)" >> .env

# ==============================
# React / Frontend
# ==============================

# 依存関係インストール
install-frontend:
	cd frontend && npm ci

# 開発サーバー起動
run-frontend:
	cd frontend && npm run dev

# API クライアント生成
generate-api:
	cd frontend && npm run generate:api

# React (frontend) のテストを実行
test-frontend:
	cd frontend && npm run test

# ==============================
# 開発便利コマンド
# ==============================

# ローカル venv で両方の開発サーバーを並行起動
dev:
	make -j2 run-backend run-frontend

# Docker環境でバックエンド起動＋フロントエンドを並行起動
docker-dev:
	make up
	make run-frontend

# Schema と API クライアントをまとめて更新
update-api: generate-schema generate-api

# Docker バージョンの update-api
docker-update-api: docker-generate-schema generate-api