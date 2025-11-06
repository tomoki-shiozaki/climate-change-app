import csv

import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.models import ClimateData, Indicator, Region


class Command(BaseCommand):
    help = "Fetch temperature anomaly data from Our World in Data"

    def handle(self, *args, **options):
        url = "https://ourworldindata.org/grapher/temperature-anomaly.csv?v=1&csvType=full&useColumnShortNames=true"

        self.stdout.write(self.style.NOTICE("Downloading data..."))
        response = requests.get(url)
        response.encoding = "utf-8"
        lines = response.text.splitlines()
        reader = csv.DictReader(lines)

        indicator, _ = Indicator.objects.get_or_create(
            name="Near Surface Temperature Anomaly",
            defaults={
                "unit": "°C",
                "description": "Global near-surface temperature anomaly (Berkeley Earth)",
                "data_source_name": "Our World in Data",
                "data_source_url": url,
            },
        )

        created_count = 0
        updated_count = 0

        with transaction.atomic():
            for row in reader:
                entity = row["Entity"]
                code = row["Code"]
                year = row["Year"]
                value = row.get("Near surface temperature anomaly")

                if not value or not year:
                    continue

                region, _ = Region.objects.get_or_create(
                    name=entity,
                    defaults={"iso_code": code or ""},
                )

                obj, created = ClimateData.objects.update_or_create(
                    region=region,
                    indicator=indicator,
                    year=year,
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
