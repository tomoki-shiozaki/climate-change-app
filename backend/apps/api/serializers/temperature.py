from rest_framework import serializers

from apps.climate_data.models import ClimateData, Indicator


class TemperatureDataSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    value = serializers.FloatField()
