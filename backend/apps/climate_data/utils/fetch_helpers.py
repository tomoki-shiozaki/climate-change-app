import csv

import requests

from apps.climate_data.models import ClimateData, Indicator, Region


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


def get_or_create_region(entity: str, code: str):
    region, _ = Region.objects.get_or_create(
        name=entity, defaults={"code": code if code else f"NO_CODE_{entity}"}
    )
    return region


def get_or_create_indicator(
    group, column_key: str, info: dict, csv_url: str, meta_url: str
):
    indicator, _ = Indicator.objects.get_or_create(
        group=group,
        name=info.get("titleShort", column_key),
        defaults={
            "unit": info.get("shortUnit", info.get("unit", "")),
            "description": info.get("descriptionShort", ""),
            "data_source_name": "Our World in Data",
            "data_source_url": csv_url,
            "metadata_url": info.get("fullMetadata", meta_url),
        },
    )
    return indicator


def update_climate_data(region, indicator, year: int, value: float):
    obj, created = ClimateData.objects.update_or_create(
        region=region, indicator=indicator, year=year, defaults={"value": value}
    )
    return created
