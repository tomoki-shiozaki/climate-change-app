#!/bin/sh
set -e  # エラーがあったら即終了

# 本番用設定モジュール
export DJANGO_SETTINGS_MODULE=config.settings

echo "Running migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3
