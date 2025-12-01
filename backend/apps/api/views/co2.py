from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.serializers.co2 import CO2DataByYearSerializer
from apps.climate_data.models import ClimateData, Indicator


class CO2DataByYearView(APIView):
    """
    フロント用 API
    /api/co2-data/
    """

    def get(self, request):
        # settings.py から CO2 指標グループ名と列名を取得
        co2_group_info = settings.CLIMATE_GROUPS["CO2"]
        co2_group_name = co2_group_info["name"]
        co2_column_key = co2_group_info.get("column_key", "emissions_total")

        # CO2 指標を単一オブジェクトとして取得
        co2_indicator = get_object_or_404(
            Indicator,
            group__name=co2_group_name,
            name=co2_column_key,  # ここを固定文字列から設定値に変更
        )

        # 指標に紐づく ClimateData を取得
        queryset = ClimateData.objects.filter(indicator=co2_indicator)

        # シリアライザで整形して返す
        serializer = CO2DataByYearSerializer(queryset, many=True)
        return Response(serializer.data)
