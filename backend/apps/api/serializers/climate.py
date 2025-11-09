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

    class Meta:
        model = ClimateData
        fields = ["id", "region", "indicator", "year", "value", "fetched_at"]
