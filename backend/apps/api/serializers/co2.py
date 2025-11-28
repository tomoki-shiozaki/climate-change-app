from rest_framework import serializers

from apps.climate_data.models import ClimateData, Indicator, Region


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ("id", "name", "iso_code")


class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ("id", "name", "unit", "group")


# CO2データを年ごと・国コードごとにまとめて返すシリアライザ
class CO2DataByYearSerializer(serializers.Serializer):
    # 出力形式に合わせるため SerializerMethodField を使う
    data = serializers.SerializerMethodField()  # type: ignore

    def get_data(self, obj):
        """
        obj は queryset (ClimateData.objects.filter(...))
        を渡すことを想定
        """
        result = {}
        for cd in obj:
            year = cd.year
            iso = cd.region.iso_code
            if year not in result:
                result[year] = {}
            result[year][iso] = cd.value
        return result
