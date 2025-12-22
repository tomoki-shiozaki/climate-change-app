import csv

import requests


def fetch_csv(url: str):
    # 指定した URL から CSV データを取得
    response = requests.get(url)
    # 文字コードを UTF-8 に設定
    response.encoding = "utf-8"

    # 取得した CSV データを行ごとのリストに分割
    lines = response.text.splitlines()

    # csv.DictReader を使って CSV を辞書として読み込む
    # これにより各行は {列名: 値} という辞書になる
    reader = csv.DictReader(lines)

    # DictReader はイテレータなので、必要に応じて list() に変換すると
    # 複数回アクセスできるリストの形になる
    return reader
