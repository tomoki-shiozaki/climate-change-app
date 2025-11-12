from rest_framework import serializers


class YearlyTemperatureSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    upper = serializers.FloatField()
    lower = serializers.FloatField()
    global_average = serializers.FloatField()
