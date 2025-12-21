from django.core.management.base import BaseCommand
from django.db import transaction

from apps.climate_data.constants import CLIMATE_GROUPS
from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region
from apps.climate_data.utils.fetch_helpers import fetch_csv


class Command(BaseCommand):
    help = "Fetch annual CO2 emissions by world region from Our World in Data (bulk insert/update)"

    def handle(self, *args, **options):
        # =============================
        # 設定読み込み
        # =============================
        group_info = CLIMATE_GROUPS["CO2"]

        group_conf = group_info["group"]
        indicator_conf = group_info["indicator"]
        source_conf = group_info["source"]

        csv_url = source_conf["csv_url"]
        column_key = indicator_conf["column_key"]

        # =============================
        # IndicatorGroup 取得 or 作成
        # =============================
        group, _ = IndicatorGroup.objects.get_or_create(
            name=group_conf["name"],
            defaults={
                "description": group_conf["description"],
            },
        )

        # =============================
        # Indicator 取得 or 作成
        # =============================
        indicator, _ = Indicator.objects.get_or_create(
            group=group,
            name=indicator_conf["name"],
            defaults={
                "unit": indicator_conf["unit"],
                "description": indicator_conf["description"],
                "data_source_name": indicator_conf["data_source_name"],
                "data_source_url": indicator_conf["data_source_url"],
                # meta_url は「保持したいなら」ここ
                "metadata_url": source_conf.get("meta_url", ""),
            },
        )

        # =============================
        # CSV データ取得
        # =============================
        self.stdout.write(self.style.NOTICE("Downloading CSV data..."))
        # CSV をダウンロードして辞書のリストに変換
        # 各要素は {'Entity': 'Japan', 'Code': 'JPN', 'Year': '2020', 'emissions_total': '36000'} のような辞書
        reader = list(fetch_csv(csv_url))

        # =============================
        # キャッシュ作成
        # =============================
        region_cache = {r.code: r for r in Region.objects.all()}

        # =============================
        # 既存データ取得
        # =============================
        years = {
            int(row["Year"])
            for row in reader
            if row.get("Year") and row["Year"].isdigit()
        }

        existing_data = ClimateData.objects.filter(
            indicator=indicator,
            year__in=years,
            region__in=region_cache.values(),
        )

        existing_map = {(cd.region.pk, cd.year): cd for cd in existing_data}

        to_create = []
        to_update = []

        # =============================
        # CSV 行処理
        # =============================
        for row in reader:
            entity = row.get("Entity", "")
            code = row.get("Code", "") or f"NO_CODE_{entity.replace(' ', '_')}"

            year_raw = row.get("Year")
            if not year_raw or not year_raw.isdigit():
                continue

            year = int(year_raw)

            # Region 取得 or 作成
            if code in region_cache:
                region = region_cache[code]
            else:
                region = Region.objects.create(
                    name=entity,
                    code=code,
                )
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

            key = (region.pk, year)
            if key in existing_map:
                # 既存は更新
                cd = existing_map[key]
                cd.value = value
                to_update.append(cd)
            else:
                # 新規は作成
                to_create.append(
                    ClimateData(
                        region=region,
                        indicator=indicator,
                        year=year,
                        value=value,
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
