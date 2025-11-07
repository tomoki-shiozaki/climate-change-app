import csv

import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.models import ClimateData, Indicator, Region


class Command(BaseCommand):
    help = "Fetch temperature anomaly data from Our World in Data"

    def handle(self, *args, **options):
        # データURLとメタデータURL
        csv_url = "https://ourworldindata.org/grapher/temperature-anomaly.csv?v=1&csvType=full&useColumnShortNames=true"
        meta_url = "https://ourworldindata.org/grapher/temperature-anomaly.metadata.json?v=1&csvType=full&useColumnShortNames=true"

        # -----------------------------
        # CSVデータ取得
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Downloading CSV data..."))
        response = requests.get(csv_url)
        response.encoding = "utf-8"
        lines = response.text.splitlines()
        reader = csv.DictReader(lines)

        # -----------------------------
        # メタデータ取得
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Downloading metadata..."))
        meta_response = requests.get(meta_url)
        meta_response.raise_for_status()
        meta = meta_response.json()

        # -----------------------------
        # 数値列（Numeric）のキーを取得
        # -----------------------------
        numeric_columns = {
            key: info
            for key, info in meta["columns"].items()
            if info.get("type") == "Numeric"
        }

        # Indicator キャッシュ
        indicator_cache = {}

        created_count = 0
        updated_count = 0

        with transaction.atomic():
            for row in reader:
                entity = row.get("Entity", "")
                code = row.get("Code", "")
                year_raw = row.get("Year", "")
                if not year_raw:
                    continue

                try:
                    year = int(year_raw)
                except ValueError:
                    self.stdout.write(
                        self.style.WARNING(f"Skipping invalid year: {year_raw}")
                    )
                    continue

                # 地域取得または作成
                region, _ = Region.objects.get_or_create(
                    name=entity,
                    defaults={"iso_code": code if code else f"NO_CODE_{entity}"},
                )

                # 各数値列を処理
                for column_key, info in numeric_columns.items():
                    value_raw = row.get(column_key)
                    if (
                        value_raw is None
                        or value_raw == ""
                        or value_raw.lower() == "nan"
                    ):
                        continue

                    try:
                        value = float(value_raw)
                    except ValueError:
                        self.stdout.write(
                            self.style.WARNING(
                                f"Skipping invalid value for {column_key}: {value_raw}"
                            )
                        )
                        continue

                    # Indicator をキャッシュから取得、無ければ作成
                    if column_key in indicator_cache:
                        indicator = indicator_cache[column_key]
                    else:
                        indicator, _ = Indicator.objects.get_or_create(
                            name=info.get("titleShort", column_key),
                            defaults={
                                "unit": info.get("shortUnit", info.get("unit", "")),
                                "description": info.get("descriptionShort", ""),
                                "data_source_name": "Our World in Data",
                                "data_source_url": csv_url,  # CSV の URL を使用
                            },
                        )
                        indicator_cache[column_key] = indicator

                    # ClimateData更新または作成
                    obj, created = ClimateData.objects.update_or_create(
                        region=region,
                        indicator=indicator,
                        year=year,
                        defaults={"value": value},
                    )

                    if created:
                        created_count += 1
                    else:
                        updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Import completed: {created_count} created, {updated_count} updated."
            )
        )
