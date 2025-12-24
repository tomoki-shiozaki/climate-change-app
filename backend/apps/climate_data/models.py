from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


# 地域マスター
class Region(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(
        max_length=100,
        unique=True,
        help_text=(
            "OWIDデータに基づく地域コード。"
            "優先順はOWIDの仕様に従い、"
            "1) ISO A3コード、"
            "2) OWID独自コード (例: OWID_WRL)、"
            "3) 上記が存在しない場合はアプリ側で自動生成"
        ),
    )

    @classmethod
    def generate_code(cls, *, entity: str) -> str:
        """
        CSV に Code が存在しない場合の region.code を生成する。

        - 外部データ由来であることを示すため AUTO_ を付与
        - 同じ entity からは常に同じ code が生成される

        例:
        - entity="Japan" -> "AUTO_JAPAN"
        - entity="North America" -> "AUTO_NORTH_AMERICA"
        """
        base = entity.strip().upper().replace(" ", "_")
        return f"AUTO_{base}"

    @classmethod
    def from_owid_row(cls, row, *, cache: dict[str, "Region"] | None = None):
        entity = (row.get("Entity") or "").strip()
        raw_code = (row.get("Code") or "").strip()

        code = raw_code or cls.generate_code(entity=entity)

        if cache is not None and code in cache:
            return cache[code]

        region, _ = cls.objects.get_or_create(
            code=code,
            defaults={"name": entity},
        )

        if cache is not None:
            cache[code] = region

        return region

    class Meta:
        verbose_name = "地域"
        verbose_name_plural = "地域マスター"

    def __str__(self):
        return self.name


# 指標グループ（例：Temperature, CO2, Precipitation など）
class IndicatorGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "指標グループ"
        verbose_name_plural = "指標グループ"

    def __str__(self):
        return self.name


# 指標マスター（例：Mean temperature, Max temperature, Min temperature など）
class Indicator(models.Model):
    group = models.ForeignKey(
        IndicatorGroup,
        on_delete=models.CASCADE,
        related_name="indicators",
        verbose_name="指標グループ",
    )
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    data_source_name = models.CharField(max_length=255)
    data_source_url = models.URLField()
    metadata_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "指標"
        verbose_name_plural = "指標マスター"
        constraints = [
            models.UniqueConstraint(
                fields=["group", "name"],
                name="unique_indicator_per_group",
            )
        ]

    def __str__(self):
        return f"{self.group.name} - {self.name}"


# 気候データ
class ClimateData(models.Model):
    region = models.ForeignKey(
        Region, on_delete=models.CASCADE, related_name="climate_data"
    )
    indicator = models.ForeignKey(
        Indicator, on_delete=models.CASCADE, related_name="climate_data"
    )
    year = models.IntegerField(
        validators=[
            MinValueValidator(-10000),
            MaxValueValidator(10000),
        ]
    )
    value = models.FloatField()
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="全件再取得バッチによりこのレコードが最後に更新された日時",
    )

    class Meta:
        unique_together = ("region", "indicator", "year")  # 同一組み合わせの重複防止
        indexes = [
            models.Index(fields=["indicator", "year", "region"]),
        ]
        verbose_name = "気候データ"
        verbose_name_plural = "気候データ"

    def __str__(self):
        return f"{self.region} - {self.indicator} ({self.year})"
