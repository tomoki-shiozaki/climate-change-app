from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.constants import CLIMATE_GROUPS
from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region
from apps.climate_data.utils.fetch_helpers import fetch_csv
from apps.climate_data.utils.parse_helpers import parse_float, parse_year


class Command(BaseCommand):
    help = "Import temperature anomaly data from Our World in Data"

    def handle(self, *args, **options):
        # -----------------------------
        # Constants 取得
        # -----------------------------
        config = CLIMATE_GROUPS["TEMPERATURE"]
        group_info = config["group"]
        source = config["source"]
        indicators_config = config["indicators"]

        # -----------------------------
        # IndicatorGroup 取得 or 作成
        # -----------------------------
        group, _ = IndicatorGroup.objects.get_or_create(
            name=group_info["name"],
            defaults={"description": group_info["description"]},
        )

        # -----------------------------
        # CSVデータ取得
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Downloading CSV data..."))
        reader = fetch_csv(source["csv_url"])

        indicator_cache: dict[str, Indicator] = {}
        created_count = 0
        updated_count = 0

        # -----------------------------
        # Import 処理
        # -----------------------------
        with transaction.atomic():
            for row in reader:
                year = parse_year(row.get("Year"))
                if year is None:
                    continue

                entity = row.get("Entity", "")
                raw_code = (row.get("Code") or "").strip()
                region_code = raw_code or Region.generate_code(entity=entity)

                region, _ = Region.objects.get_or_create(
                    code=region_code,
                    defaults={"name": entity},
                )

                for column_key, indicator_def in indicators_config.items():
                    value = parse_float(row.get(column_key))
                    if value is None:
                        continue

                    # Indicator 作成 or キャッシュ
                    if column_key not in indicator_cache:

                        indicator, _ = Indicator.objects.get_or_create(
                            group=group,
                            name=indicator_def["name"],
                            defaults={
                                "unit": indicator_def["unit"],
                                "description": indicator_def["description"],
                                "data_source_name": source["data_source_name"],
                                "data_source_url": source["data_source_url"],
                                "metadata_url": source["meta_url"],
                            },
                        )

                        indicator_cache[column_key] = indicator

                    indicator = indicator_cache[column_key]

                    _, created = ClimateData.objects.update_or_create(
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
