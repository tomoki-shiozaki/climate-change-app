from apps.climate_data.models import Region

# OWID大陸リスト
CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"]

# 集計・特殊地域リスト（必要に応じて更新可能）
AGGREGATES = [
    "World",
    "European Union",
    "High-income countries",
    "Low-income countries",
]


class RegionService:
    @staticmethod
    def detect_code_type(iso_code: str) -> str:
        iso_code = iso_code.strip().upper()
        if len(iso_code) == 3 and iso_code.isalpha():
            return "iso"
        elif iso_code.startswith("OWID_"):
            return "owid"
        else:
            return "auto"

    @staticmethod
    def detect_region_type(name: str, code_type: str) -> str:
        name_clean = name.strip().lower()

        # ISOコードは country
        if code_type == "iso":
            return "country"

        # 大陸判定
        if name_clean in [c.lower() for c in CONTINENTS]:
            return "continent"

        # 集計判定
        if name_clean in [a.lower() for a in AGGREGATES]:
            return "aggregate"

        # それ以外は unknown
        return "unknown"

    @staticmethod
    def generate_auto_code(name: str) -> str:
        import hashlib

        safe_name = name.strip().replace(" ", "_")
        hash_suffix = hashlib.md5(name.encode("utf-8")).hexdigest()[:6].upper()
        return f"AUTO_{safe_name}_{hash_suffix}"

    @staticmethod
    def get_or_create_region(name: str, code: str) -> Region:
        """
        DBからRegionを取得、存在しなければ作成
        - code_type と region_type は自動判定
        """
        code_type = RegionService.detect_code_type(code)
        region_type = RegionService.detect_region_type(name, code_type)

        # 自動コード生成も必要に応じて対応可能
        if code_type == "auto" and not code.startswith("AUTO_"):
            code = RegionService.generate_auto_code(name)

        region, _ = Region.objects.get_or_create(
            iso_code=code,
            defaults={
                "name": name,
                "code_type": code_type,
                "region_type": region_type,
            },
        )
        return region
