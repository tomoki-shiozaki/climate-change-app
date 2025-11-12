from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.serializers.temperature import YearlyTemperatureSerializer
from apps.climate_data.models import ClimateData, Indicator


class TemperatureAPIView(APIView):
    """
    年ごとの気温データを地域ごとに返すAPI（Upper/Lower/Global average）
    """

    # Indicator名とSerializer用フィールド名の対応
    INDICATOR_FIELD_MAP = {
        "Upper bound of the annual temperature anomaly (95% confidence interval)": "upper",
        "Lower bound of the annual temperature anomaly (95% confidence interval)": "lower",
        "Global average temperature anomaly relative to 1861-1890": "global_average",
    }

    @extend_schema(
        responses=YearlyTemperatureSerializer(many=True),
        description="地域・年ごとの気温データを返します。upper, lower, global_average が含まれます。",
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

            # 地域ごとのデータ格納用
            result = {}

            for indicator in temperature_indicators:
                # 地域ごとにループ
                qs = (
                    ClimateData.objects.filter(indicator=indicator)
                    .select_related("region")
                    .order_by("year")
                )
                for item in qs:
                    region_name = item.region.name
                    if region_name not in result:
                        result[region_name] = {}

                    year = item.year
                    if year not in result[region_name]:
                        result[region_name][year] = {"year": year}

                    field_name = self.INDICATOR_FIELD_MAP[indicator.name]
                    result[region_name][year][field_name] = item.value

            # 年ごとリストに整形
            formatted_result = {
                region: [data for _, data in sorted(year_dict.items())]
                for region, year_dict in result.items()
            }

            # serializer必要か？
            return Response(formatted_result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
