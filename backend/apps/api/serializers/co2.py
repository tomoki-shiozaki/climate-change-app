from rest_framework import serializers


class CO2DataByYearSerializer(serializers.Serializer):
    data = serializers.DictField(  # type: ignore
        child=serializers.DictField(child=serializers.FloatField())
    )
