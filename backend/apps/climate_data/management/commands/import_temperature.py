import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.constants import CLIMATE_GROUPS
from apps.climate_data.models import IndicatorGroup
from apps.climate_data.utils.fetch_helpers import (
    fetch_csv,
    get_or_create_indicator,
    get_or_create_region,
    update_climate_data,
)


class Command(BaseCommand):
    help = "Fetch temperature anomaly data from Our World in Data"

    def handle(self, *args, **options):
        # -----------------------------
        # データURLとメタデータURL
        # -----------------------------
        csv_url = (
            "https://ourworldindata.org/grapher/temperature-anomaly.csv"
            "?v=1&csvType=full&useColumnShortNames=true"
        )
        meta_url = (
            "https://ourworldindata.org/grapher/temperature-anomaly.metadata.json"
            "?v=1&csvType=full&useColumnShortNames=true"
        )

        # -----------------------------
        # 指標グループを取得または作成
        # -----------------------------
        group_info = CLIMATE_GROUPS["TEMPERATURE"]
        group, _ = IndicatorGroup.objects.get_or_create(
            name=group_info["name"],
            defaults={"description": group_info["description"]},
        )

        # -----------------------------
        # CSVデータ取得
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Downloading CSV data..."))
        reader = fetch_csv(csv_url)

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

        indicator_cache = {}
        created_count = 0
        updated_count = 0

        # -----------------------------
        # トランザクション開始
        # -----------------------------
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
                region = get_or_create_region(entity, code)

                # 各数値列を処理
                for column_key, info in numeric_columns.items():
                    value_raw = row.get(column_key)
                    if (
                        value_raw is None
                        or value_raw == ""
                        or str(value_raw).lower() == "nan"
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
                        indicator = get_or_create_indicator(
                            group, column_key, info, csv_url, meta_url
                        )
                        indicator_cache[column_key] = indicator

                    # ClimateData更新または作成
                    created = update_climate_data(region, indicator, year, value)
                    if created:
                        created_count += 1
                    else:
                        updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Import completed: {created_count} created, {updated_count} updated."
            )
        )
