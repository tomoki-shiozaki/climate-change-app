from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.serializers.temperature import TemperatureDataSerializer
from apps.climate_data.models import ClimateData, Indicator


class TemperatureAPIView(APIView):
    """
    年ごとの気温データを返すAPI
    """

    def get(self, request):
        # Temperature グループの指標を取得
        try:
            temperature_indicator = Indicator.objects.filter(group__name="Temperature")
            if not temperature_indicator.exists():
                return Response(
                    {"detail": "Temperature indicator not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # ここでは一つの指標のみを想定（例えば平均気温）
            indicator = temperature_indicator.first()
            climate_data_qs = ClimateData.objects.filter(indicator=indicator).order_by(
                "year"
            )

            # シリアライズ
            data = TemperatureDataSerializer(climate_data_qs, many=True).data
            return Response(data)

        except Exception as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
