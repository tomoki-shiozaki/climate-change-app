from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


# Create your models here.
class Region(models.Model):
    name = models.CharField(max_length=255)
    iso_code = models.CharField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name = "地域"
        verbose_name_plural = "地域マスター"

    def __str__(self):
        return self.name


class Indicator(models.Model):
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
        return self.name


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
        unique_together = (
            "region",
            "indicator",
            "year",
        )  # 同じ年・地域・指標の重複防止
        verbose_name = "気候データ"
        verbose_name_plural = "気候データ"

    def __str__(self):
        return f"{self.region} - {self.indicator} ({self.year})"
