from django.db import models


# Create your models here.
class Region(models.Model):
    name = models.CharField(max_length=255)
    iso_code = models.CharField(max_length=10, unique=True, blank=True)

    def __str__(self):
        return self.name


class Indicator(models.Model):
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    data_source_name = models.CharField(max_length=255)
    data_source_url = models.URLField()
    fetched_at = models.DateTimeField(auto_now=True)  # データを取得した日

    def __str__(self):
        return self.name


class ClimateData(models.Model):
    region = models.ForeignKey(
        Region, on_delete=models.CASCADE, related_name="climate_data"
    )
    indicator = models.ForeignKey(
        Indicator, on_delete=models.CASCADE, related_name="climate_data"
    )
    year = models.IntegerField()
    value = models.FloatField()
    fetched_at = models.DateTimeField(auto_now=True)  # データを取得した日

    class Meta:
        unique_together = (
            "region",
            "indicator",
            "year",
        )  # 同じ年・地域・指標の重複防止

    def __str__(self):
        return f"{self.region} - {self.indicator} ({self.year})"
