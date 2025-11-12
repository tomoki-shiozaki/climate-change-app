from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.serializers.temperature import YearlyTemperatureSerializer
from apps.climate_data.models import ClimateData, Indicator


class TemperatureAPIView(APIView):
    """
    年ごとの気温データを返すAPI（Upper/Lower/Global average）
    """

    # Indicator名とSerializer用フィールド名の対応
    INDICATOR_FIELD_MAP = {
        "Upper bound of the annual temperature anomaly (95% confidence interval)": "upper",
        "Lower bound of the annual temperature anomaly (95% confidence interval)": "lower",
        "Global average temperature anomaly relative to 1861-1890": "global_average",
    }

    @extend_schema(
        responses=YearlyTemperatureSerializer(many=True),
        description="年ごとの気温データを返します。upper, lower, global_average が含まれます。",
    )
    def get(self, request):
        try:
            # Temperature グループの3つの指標を取得
            group_name = settings.CLIMATE_GROUPS["TEMPERATURE"]["name"]

            temperature_indicators = Indicator.objects.filter(
                group__name=group_name,
                name__in=list(self.INDICATOR_FIELD_MAP.keys()),
            )

            if temperature_indicators.count() != 3:
                return Response(
                    {"detail": "Not all temperature indicators found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # 年ごとにデータをまとめる辞書
            data_by_year = {}

            for indicator in temperature_indicators:
                qs = ClimateData.objects.filter(indicator=indicator).order_by("year")
                # ここでは単純に年と値を取得
                for item in qs:
                    year = item.year
                    if year not in data_by_year:
                        data_by_year[year] = {"year": year}
                    # フィールド名を短くして格納
                    field_name = self.INDICATOR_FIELD_MAP[indicator.name]
                    data_by_year[year][field_name] = item.value

            # 辞書をリスト化してソート
            sorted_data = [data_by_year[year] for year in sorted(data_by_year.keys())]

            # Serializerで整形して返す
            serializer = YearlyTemperatureSerializer(sorted_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
