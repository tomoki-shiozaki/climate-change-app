from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.serializers.co2 import CO2DataByYearSerializer
from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup


class CO2DataByYearView(APIView):
    """
    フロント用 API
    /api/co2-data/
    """

    def get(self, request):
        # settings.py から CO2 指標グループ名を取得
        co2_group_name = settings.CLIMATE_GROUPS["CO2"]["name"]

        # IndicatorGroup で絞り込む
        try:
            co2_group = IndicatorGroup.objects.get(name=co2_group_name)
        except IndicatorGroup.DoesNotExist:
            return Response(
                {"error": f"IndicatorGroup '{co2_group_name}' not found."}, status=404
            )

        # そのグループに属する CO2 指標を取得（最初の1つだけ）
        co2_indicator = Indicator.objects.filter(group=co2_group).first()
        if not co2_indicator:
            return Response(
                {"error": f"No Indicator found for group '{co2_group_name}'."},
                status=404,
            )

        # 指標に紐づく ClimateData を取得
        queryset = ClimateData.objects.filter(indicator=co2_indicator)

        # シリアライザで整形して返す
        serializer = CO2DataByYearSerializer(queryset)
        return Response(serializer.data)
