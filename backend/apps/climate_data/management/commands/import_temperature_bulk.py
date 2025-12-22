import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.constants import CLIMATE_GROUPS
from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region
from apps.climate_data.utils.fetch_helpers import fetch_csv


class Command(BaseCommand):
    help = "Fetch temperature anomaly data from Our World in Data"

    def handle(self, *args, **options):
        # =============================
        # 設定読み込み
        # =============================
        group_info = CLIMATE_GROUPS["TEMPERATURE"]
        group_name = group_info["name"]
        group_description = group_info["description"]

        csv_url = "https://ourworldindata.org/grapher/temperature-anomaly.csv?v=1&csvType=full&useColumnShortNames=true"
        meta_url = "https://ourworldindata.org/grapher/temperature-anomaly.metadata.json?v=1&csvType=full&useColumnShortNames=true"

        # =============================
        # IndicatorGroup 取得 or 作成
        # =============================
        group, _ = IndicatorGroup.objects.get_or_create(
            name=group_name,
            defaults={"description": group_description},
        )

        # =============================
        # メタデータ取得
        # =============================
        self.stdout.write(self.style.NOTICE("Downloading metadata..."))
        meta_response = requests.get(meta_url)
        meta_response.raise_for_status()
        meta = meta_response.json()

        # 数値列のみ
        numeric_columns = {
            key: info
            for key, info in meta["columns"].items()
            if info.get("type") == "Numeric"
        }

        # =============================
        # CSV データ取得
        # =============================
        self.stdout.write(self.style.NOTICE("Downloading CSV data..."))
        reader = list(fetch_csv(csv_url))

        # =============================
        # Region キャッシュ作成
        # =============================
        region_cache = {r.code: r for r in Region.objects.all()}

        # =============================
        # Indicator キャッシュ作成
        # =============================
        indicator_cache = {}
        for column_key, info in numeric_columns.items():
            indicator, _ = Indicator.objects.get_or_create(
                group=group,
                name=column_key,
                defaults={
                    "unit": info.get("unit", ""),
                    "description": info.get("description", ""),
                    "data_source_name": "Our World in Data",
                    "data_source_url": csv_url,
                    "metadata_url": meta_url,
                },
            )
            indicator_cache[column_key] = indicator

        # =============================
        # 既存 ClimateData 取得
        # =============================
        years = {
            int(row["Year"])
            for row in reader
            if row.get("Year") and row["Year"].isdigit()
        }
        existing_data = ClimateData.objects.filter(
            indicator__in=indicator_cache.values(),
            year__in=years,
            region__in=region_cache.values(),
        )
        existing_map = {
            (cd.region.pk, cd.indicator.pk, cd.year): cd for cd in existing_data
        }

        to_create = []
        to_update = []

        # =============================
        # CSV 行処理
        # =============================
        for row in reader:
            entity = row.get("Entity", "").strip()
            raw_code = (row.get("Code") or "").strip()
            code = raw_code or Region.generate_code(entity=entity)

            year_raw = row.get("Year")
            if not year_raw or not year_raw.isdigit():
                continue
            year = int(year_raw)

            # Region 取得 or 作成
            if code in region_cache:
                region = region_cache[code]
            else:
                region = Region.objects.create(name=entity, code=code)
                region_cache[code] = region

            # 各 Indicator 列を処理
            for column_key, indicator in indicator_cache.items():
                value_raw = row.get(column_key)
                if value_raw in (None, "", "NaN", "nan"):
                    continue
                try:
                    value = float(value_raw)
                except ValueError:
                    self.stdout.write(
                        self.style.WARNING(f"Skipping invalid value: {value_raw}")
                    )
                    continue

                key = (region.pk, indicator.pk, year)
                if key in existing_map:
                    cd = existing_map[key]
                    if cd.value != value:
                        cd.value = value
                        to_update.append(cd)
                else:
                    to_create.append(
                        ClimateData(
                            region=region, indicator=indicator, year=year, value=value
                        )
                    )

        # =============================
        # バルク挿入 & 更新
        # =============================
        self.stdout.write(
            self.style.NOTICE(f"Inserting {len(to_create)} new records...")
        )
        self.stdout.write(
            self.style.NOTICE(f"Updating {len(to_update)} existing records...")
        )

        with transaction.atomic():
            if to_create:
                ClimateData.objects.bulk_create(to_create)
            if to_update:
                ClimateData.objects.bulk_update(to_update, ["value"])

        self.stdout.write(self.style.SUCCESS("Import completed!"))
