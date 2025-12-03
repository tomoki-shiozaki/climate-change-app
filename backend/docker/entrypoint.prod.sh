#!/bin/sh
set -e  # エラーがあったら即終了

# Cloud Runでは migrate や collectstatic は事前実行済み
echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3
