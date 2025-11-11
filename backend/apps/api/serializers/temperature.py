from rest_framework import serializers


class YearlyTemperatureSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    upper = serializers.FloatField(
        source="Upper bound of the annual temperature anomaly (95% confidence interval)"
    )
    lower = serializers.FloatField(
        source="Lower bound of the annual temperature anomaly (95% confidence interval)"
    )
    global_average = serializers.FloatField(
        source="Global average temperature anomaly relative to 1861-1890"
    )
