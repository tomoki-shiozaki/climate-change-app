from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.climate_data.models import ClimateData, Indicator, Region


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ["id", "name", "iso_code"]


class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = [
            "id",
            "name",
            "unit",
            "description",
            "data_source_name",
            "data_source_url",
        ]


class ClimateDataSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    indicator = IndicatorSerializer(read_only=True)

    # year フィールドの OpenAPI スキーマ型を int64 にする
    @extend_schema_field(OpenApiTypes.INT64)
    def year(self):
        return self.instance.year if self.instance else None

    class Meta:
        model = ClimateData
        fields = ["id", "region", "indicator", "year", "value", "fetched_at"]
