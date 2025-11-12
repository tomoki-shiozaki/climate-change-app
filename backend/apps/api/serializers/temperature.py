from rest_framework import serializers


class YearlyTemperatureSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    upper = serializers.FloatField()
    lower = serializers.FloatField()
    global_average = serializers.FloatField()


class TemperatureByRegionSerializer(serializers.Serializer):
    """
    地域ごとの気温データを表すSerializer。
    例: { "World": [YearlyTemperature, ...], "Northern hemisphere": [YearlyTemperature, ...] }
    """

    # 地域名: str → 値: YearlyTemperatureSerializer(many=True)
    data = serializers.DictField(child=YearlyTemperatureSerializer(many=True))  # type: ignore
