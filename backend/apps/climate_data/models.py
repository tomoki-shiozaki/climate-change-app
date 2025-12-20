from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


# 地域マスター
class Region(models.Model):
    # 表示用
    name = models.CharField(max_length=255)

    # 統一キー
    iso_code = models.CharField(
        max_length=100,
        unique=True,
        help_text="優先順: 1) ISO alpha-3コード, 2) OWID独自コード, 3) 自動生成コード",
    )

    # コードの種類
    CODE_TYPE_CHOICES = [
        ("iso", "ISO alpha-3"),
        ("owid", "OWID独自コード"),
        ("auto", "自動生成コード"),
    ]
    code_type = models.CharField(
        max_length=10,
        choices=CODE_TYPE_CHOICES,
        default="auto",
        help_text="iso_codeの種類",
    )

    # 国・大陸・集計区分
    REGION_TYPE_CHOICES = [
        ("country", "国"),
        ("continent", "大陸"),
        ("aggregate", "集計地域"),
        ("unknown", "不明"),
    ]
    region_type = models.CharField(
        max_length=20,
        choices=REGION_TYPE_CHOICES,
        default="country",
        help_text="国、集計地域、大陸などの区分",
    )

    # 作成日時・更新日時（任意）
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "地域"
        verbose_name_plural = "地域マスター"
        ordering = ["name"]

    def __str__(self):
        return self.name


# 指標グループ（例：Temperature, CO2, Precipitation など）
class IndicatorGroup(models.Model):
    name = models.CharField(max_length=100)
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
    fetched_at = models.DateTimeField(auto_now=True)  # データを取得した日

    class Meta:
        verbose_name = "指標"
        verbose_name_plural = "指標マスター"

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
            MinValueValidator(1800),
            MaxValueValidator(2200),
        ]
    )
    value = models.FloatField()
    fetched_at = models.DateTimeField(auto_now=True)  # データを取得した日

    class Meta:
        unique_together = ("region", "indicator", "year")  # 同一組み合わせの重複防止
        verbose_name = "気候データ"
        verbose_name_plural = "気候データ"

    def __str__(self):
        return f"{self.region} - {self.indicator} ({self.year})"
