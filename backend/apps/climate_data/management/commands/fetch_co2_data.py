import requests
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.models import IndicatorGroup
from apps.climate_data.utils.fetch_helpers import (
    fetch_csv,
    get_or_create_indicator,
    get_or_create_region,
    update_climate_data,
)


class Command(BaseCommand):
    help = "Fetch annual CO2 emissions by world region from Our World in Data"

    def handle(self, *args, **options):
        # -----------------------------
        # データURLとメタデータURL
        # -----------------------------
        csv_url = (
            "https://ourworldindata.org/grapher/annual-co-emissions-by-region.csv"
            "?v=1&csvType=full&useColumnShortNames=true"
        )
        meta_url = (
            "https://ourworldindata.org/grapher/annual-co-emissions-by-region.metadata.json"
            "?v=1&csvType=full&useColumnShortNames=true"
        )

        # -----------------------------
        # 指標グループを取得または作成
        # -----------------------------
        group_info = settings.CLIMATE_GROUPS["CO2"]
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

                # emissions_total 列だけ処理
                column_key = "emissions_total"
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

                # Indicator を取得または作成
                if column_key in indicator_cache:
                    indicator = indicator_cache[column_key]
                else:
                    indicator = get_or_create_indicator(
                        group, column_key, {}, csv_url, meta_url
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
