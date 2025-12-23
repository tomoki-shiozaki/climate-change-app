from typing import Dict, List, Optional, TypedDict

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.climate_data.constants import CLIMATE_GROUPS
from apps.climate_data.models import ClimateData, Indicator
from utils.constants import APITag
from utils.schema import schema

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
# キーは地域名（例: "World", "Northern Hemisphere", "Southern Hemisphere"）
# 値はその地域の年ごとの気温データリスト
TemperatureDataByRegion = Dict[str, List[YearlyTemperature]]


# ===============================
# 🔹 API View
# ===============================


class TemperatureAPIView(APIView):
    """
    年ごとの気温データを地域ごとに返すAPI
    Upper / Lower / Global average を含む
    """

    # NOTE:
    # 現在は Indicator.name をロジックキーとして使用している。
    # 表示名変更の予定がないため暫定的にこの形を採用。
    # 将来的には Indicator.key（不変識別子）をモデルに追加し、
    # constants / DB / API を key ベースで統一する想定。

    # Indicator名とフィールド名の対応マップ
    temperature_indicator_defs = CLIMATE_GROUPS["TEMPERATURE"]["indicators"]

    UPPER_NAME = temperature_indicator_defs["near_surface_temperature_anomaly_upper"][
        "name"
    ]
    LOWER_NAME = temperature_indicator_defs["near_surface_temperature_anomaly_lower"][
        "name"
    ]
    GLOBAL_AVG_NAME = temperature_indicator_defs["near_surface_temperature_anomaly"][
        "name"
    ]

    INDICATOR_NAME_TO_FIELD_MAP = {
        UPPER_NAME: "upper",
        LOWER_NAME: "lower",
        GLOBAL_AVG_NAME: "global_average",
    }

    @schema(
        summary="気温データ取得",
        description=(
            "地域・年ごとの気温データを返します。"
            "upper, lower, global_average を含みます。"
        ),
        tags=[APITag.TEMPERATURE.value],
        responses=TemperatureDataByRegion,
    )
    def get(self, request):
        """
        地域・年ごとの気温データを取得し、JSONとして返す。
        """

        # ===============================
        # 🔹 Temperature グループ名を取得
        # ===============================
        # constants で定義されている Temperature グループの表示名を使用
        group_name: str = CLIMATE_GROUPS["TEMPERATURE"]["group"]["name"]

        # ===============================
        # 🔹 Temperature グループに属する3つの Indicator を取得
        # ===============================
        # 現在は Indicator.name をキーとして使用しているため、
        # name が INDICATOR_NAME_TO_FIELD_MAP に含まれるものだけを取得する
        indicators_qs = Indicator.objects.filter(
            group__name=group_name,
            name__in=self.INDICATOR_NAME_TO_FIELD_MAP.keys(),
        )

        # 想定している 3 指標（upper / lower / global_average）が
        # すべて揃っていない場合はエラーとする
        if indicators_qs.count() != 3:
            return Response(
                {"detail": "Not all temperature indicators found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ===============================
        # 🔹 ClimateData をまとめて取得
        # ===============================
        # Indicator ごとにクエリを発行せず、
        # 必要なデータを一括で取得する
        climate_qs = (
            ClimateData.objects.filter(indicator__in=indicators_qs)
            .select_related("region", "indicator")
            .order_by("year")
        )

        # ===============================
        # 🔹 データ格納用辞書
        # ===============================
        # 構造:
        # {
        #   "World": {
        #       1900: {"year": 1900, "upper": ..., "lower": ..., "global_average": ...},
        #       1901: {...},
        #   },
        #   "Northern Hemisphere": {...}
        # }
        result: Dict[str, Dict[int, YearlyTemperature]] = {}

        # ===============================
        # 🔹 ClimateData を処理
        # ===============================
        for item in climate_qs:
            region_name: str = item.region.name
            year: int = item.year

            # Indicator.name から API レスポンス用フィールド名に変換
            # 例: "Temperature anomaly (upper bound)" -> "upper"
            field_name: str = self.INDICATOR_NAME_TO_FIELD_MAP[item.indicator.name]

            # ===============================
            # 🔹 region / year の初期化
            # ===============================
            region_data = result.setdefault(region_name, {})
            year_data = region_data.setdefault(year, {"year": year})

            # ===============================
            # 🔹 該当フィールドに値を格納
            # ===============================
            year_data[field_name] = item.value

        # ===============================
        # 🔹 year ごとの dict を list に変換してソート
        # ===============================
        # API の返却形式:
        # {
        #   "World": [
        #       {"year": 1900, "upper": ..., "lower": ..., "global_average": ...},
        #       {"year": 1901, ...}
        #   ],
        #   ...
        # }
        formatted_result: TemperatureDataByRegion = {
            region: [data for _, data in sorted(year_dict.items())]
            for region, year_dict in result.items()
        }

        return Response(formatted_result, status=status.HTTP_200_OK)
