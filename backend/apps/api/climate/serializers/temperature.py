from rest_framework import serializers


class YearlyTemperatureSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    upper = serializers.FloatField(required=False)
    lower = serializers.FloatField(required=False)
    global_average = serializers.FloatField(required=False)


class TemperatureByRegionSerializer(serializers.Serializer):
    # 任意の地域名をキーにして、YearlyTemperature のリスト
    __root__ = serializers.DictField(child=YearlyTemperatureSerializer(many=True))
