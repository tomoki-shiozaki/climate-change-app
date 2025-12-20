import requests
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region
from apps.climate_data.services.region_service import (
    RegionService,  # 先ほどの RegionService を想定
)
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
        # 指標グループ取得 or 作成
        # -----------------------------
        group_info = settings.CLIMATE_GROUPS["CO2"]
        group, _ = IndicatorGroup.objects.get_or_create(
            name=group_info["name"],
            defaults={"description": group_info["description"]},
        )
        column_key = group_info.get("column_key", "emissions_total")

        # -----------------------------
        # CSV取得
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Downloading CSV data..."))
        reader = list(fetch_csv(csv_url))

        # -----------------------------
        # メタデータ取得
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Downloading metadata..."))
        meta_response = requests.get(meta_url)
        meta_response.raise_for_status()
        meta = meta_response.json()
        col_meta = meta["columns"].get(column_key, {})

        # -----------------------------
        # Indicator取得 or 作成
        # -----------------------------
        indicator, created = group.indicators.get_or_create(
            name=column_key,
            defaults={
                "unit": col_meta.get("unit", ""),
                "description": col_meta.get("descriptionShort", ""),
                "data_source_name": "Our World in Data",
                "data_source_url": csv_url,
                "metadata_url": meta_url,
            },
        )

        # -----------------------------
        # 既存データ取得
        # -----------------------------
        years = [int(row["Year"]) for row in reader if row.get("Year")]
        existing_data = ClimateData.objects.filter(
            indicator=indicator,
            year__in=years,
        )
        existing_map = {(cd.region.iso_code, cd.year): cd for cd in existing_data}

        to_create = []
        to_update = []

        for row in reader:
            entity = row.get("Entity", "")
            code = row.get("Code", "")
            if not code:
                code = f"NO_CODE_{entity.replace(' ', '_')}"

            year_raw = row.get("Year")
            if not year_raw:
                continue
            try:
                year = int(year_raw)
            except ValueError:
                self.stdout.write(
                    self.style.WARNING(f"Skipping invalid year: {year_raw}")
                )
                continue

            # -----------------------------
            # Region取得 or 作成（RegionService使用）
            # -----------------------------
            region = RegionService.get_or_create_region(entity, code)

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

            key = (region.iso_code, year)
            if key in existing_map:
                cd = existing_map[key]
                cd.value = value
                to_update.append(cd)
            else:
                to_create.append(
                    ClimateData(
                        region=region, indicator=indicator, year=year, value=value
                    )
                )

        # -----------------------------
        # バルク挿入・更新
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
