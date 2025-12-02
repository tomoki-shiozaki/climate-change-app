import requests
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region
from apps.climate_data.utils.fetch_helpers import fetch_csv


class Command(BaseCommand):
    help = "Fetch annual CO2 emissions by world region from Our World in Data (bulk insert/update)"

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

        # CSV列名も設定から取得
        column_key = group_info.get("column_key", "emissions_total")

        # -----------------------------
        # CSVデータ取得
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Downloading CSV data..."))
        reader = list(fetch_csv(csv_url))  # list化して複数回アクセス可能に

        # -----------------------------
        # メタデータ取得
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Downloading metadata..."))
        meta_response = requests.get(meta_url)
        meta_response.raise_for_status()
        meta = meta_response.json()
        col_meta = meta["columns"].get(column_key, {})

        # -----------------------------
        # キャッシュ作成
        # -----------------------------
        region_cache = {r.iso_code: r for r in Region.objects.all()}
        indicator_cache = {i.name: i for i in Indicator.objects.filter(group=group)}
        # 必要な Indicator がなければ作成してキャッシュに追加
        if column_key not in indicator_cache:
            indicator_cache[column_key] = Indicator.objects.create(
                group=group,
                name=column_key,
                unit=col_meta.get("unit", ""),
                description=col_meta.get("descriptionShort", ""),
                data_source_name="Our World in Data",
                data_source_url=csv_url,
                metadata_url=meta_url,
            )
        indicator = indicator_cache[column_key]

        # -----------------------------
        # 既存データ取得
        # -----------------------------
        years = [int(row["Year"]) for row in reader if row.get("Year")]
        existing_data = ClimateData.objects.filter(
            indicator=indicator,
            year__in=years,
            region__in=region_cache.values(),  # Regionオブジェクトを直接指定
        )
        # Regionオブジェクトをキーにして map 作成
        existing_map = {(cd.region, cd.year): cd for cd in existing_data}

        to_create = []
        to_update = []

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

            # Region 取得または作成
            if code in region_cache:
                region = region_cache[code]
            else:
                region = Region.objects.create(name=entity, iso_code=code)
                region_cache[code] = region

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

            key = (region, year)
            if key in existing_map:
                # 既存は更新
                cd = existing_map[key]
                cd.value = value
                to_update.append(cd)
            else:
                # 新規は作成
                to_create.append(
                    ClimateData(
                        region=region, indicator=indicator, year=year, value=value
                    )
                )

        # -----------------------------
        # バルク挿入 & 更新
        # -----------------------------
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
