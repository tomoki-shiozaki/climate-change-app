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

        # ① メタデータ取得
        self.stdout.write(self.style.NOTICE("Downloading metadata..."))  # type: ignore
        meta_response = requests.get(meta_url)
        meta_response.raise_for_status()
        meta = meta_response.json()

        # 指標情報を自動取得
        column_key = "near_surface_temperature_anomaly"
        column_info = meta["columns"][column_key]

        indicator, _ = Indicator.objects.get_or_create(
            name=column_info["titleLong"],
            defaults={
                "unit": column_info.get("shortUnit", ""),
                "description": column_info.get("descriptionShort", ""),
                "data_source_name": "Our World in Data",
                "data_source_url": meta_url,
            },
        )

        # ② CSVデータ取得
        self.stdout.write(self.style.NOTICE("Downloading CSV data..."))
        response = requests.get(csv_url)
        response.encoding = "utf-8"
        lines = response.text.splitlines()
        reader = csv.DictReader(lines)

        created_count = 0
        updated_count = 0

        # ③ データベースに保存
        with transaction.atomic():
            for row in reader:
                entity = row["Entity"]
                code = row["Code"]
                year = row["Year"]
                value = row.get(column_key)

                if not value or not year:
                    continue

                region, _ = Region.objects.get_or_create(
                    name=entity,
                    defaults={"iso_code": code if code else f"NO_CODE_{entity}"},
                )

                obj, created = ClimateData.objects.update_or_create(
                    region=region,
                    indicator=indicator,
                    year=int(year),
                    defaults={"value": float(value)},
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
