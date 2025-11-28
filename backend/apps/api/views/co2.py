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
        # settings.py から CO2 指標グループ名を取得
        co2_group_name = settings.CLIMATE_GROUPS["CO2"]["name"]

        # CO2 指標を単一オブジェクトとして取得
        co2_indicator = get_object_or_404(
            Indicator, group__name=co2_group_name, name="CO2"
        )

        # 指標に紐づく ClimateData を取得
        queryset = ClimateData.objects.filter(indicator=co2_indicator)

        # シリアライザで整形して返す
        serializer = CO2DataByYearSerializer(queryset)
        return Response(serializer.data)
