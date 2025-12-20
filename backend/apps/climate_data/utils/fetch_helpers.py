import csv

import requests

from apps.climate_data.models import ClimateData, Indicator, Region


def fetch_csv(url: str):
    response = requests.get(url)
    response.encoding = "utf-8"
    lines = response.text.splitlines()
    reader = csv.DictReader(lines)
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
