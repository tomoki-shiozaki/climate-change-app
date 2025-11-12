from typing import Dict, List, Optional, TypedDict

from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.climate_data.models import ClimateData, Indicator

# ===============================
# 🔹 型定義（返却データ構造）
# ===============================


class YearlyTemperature(TypedDict, total=False):
    """
    1年分の気温データ構造
    """

    year: int
    upper: Optional[float]
    lower: Optional[float]
    global_average: Optional[float]


# 地域ごとのデータ構造
TemperatureDataByRegion = Dict[str, List[YearlyTemperature]]


# ===============================
# 🔹 API View
# ===============================


class TemperatureAPIView(APIView):
    """
    年ごとの気温データを地域ごとに返すAPI
    Upper / Lower / Global average を含む
    """

    # Indicator名とフィールド名の対応マップ
    INDICATOR_FIELD_MAP: Dict[str, str] = {
        "Upper bound of the annual temperature anomaly (95% confidence interval)": "upper",
        "Lower bound of the annual temperature anomaly (95% confidence interval)": "lower",
        "Global average temperature anomaly relative to 1861-1890": "global_average",
    }

    @extend_schema(
        responses=TemperatureDataByRegion,
        description="地域・年ごとの気温データを返します。upper, lower, global_average を含みます。",
    )
    def get(self, request):
        """
        地域・年ごとの気温データを取得し、JSONとして返す。
        """
        try:
            # ===============================
            # Temperatureグループの3つの指標を取得
            # ===============================
            group_name: str = settings.CLIMATE_GROUPS["TEMPERATURE"]["name"]

            temperature_indicators = Indicator.objects.filter(
                group__name=group_name,
                name__in=list(self.INDICATOR_FIELD_MAP.keys()),
            )

            if temperature_indicators.count() != 3:
                return Response(
                    {"detail": "Not all temperature indicators found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # ===============================
            # データ格納用辞書（region -> year -> values）
            # ===============================
            result: Dict[str, Dict[int, YearlyTemperature]] = {}

            # ===============================
            # 各Indicator（upper/lower/global_average）ごとに処理
            # ===============================
            for indicator in temperature_indicators:
                qs = (
                    ClimateData.objects.filter(indicator=indicator)
                    .select_related("region")
                    .order_by("year")
                )

                for item in qs:
                    region_name: str = item.region.name
                    year: int = item.year
                    field_name: str = self.INDICATOR_FIELD_MAP[indicator.name]

                    # 地域がまだ登録されていなければ初期化
                    if region_name not in result:
                        result[region_name] = {}

                    # 年がまだ登録されていなければ初期化
                    if year not in result[region_name]:
                        result[region_name][year] = {"year": year}

                    # 該当フィールドに値を格納
                    result[region_name][year][field_name] = item.value

            # ===============================
            # 年ごとにリスト化してソート
            # ===============================
            formatted_result: TemperatureDataByRegion = {
                region: [data for _, data in sorted(year_dict.items())]
                for region, year_dict in result.items()
            }

            return Response(formatted_result, status=status.HTTP_200_OK)

        except Exception as e:
            # 予期せぬエラーをキャッチ
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
