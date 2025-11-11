from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.serializers.temperature import TemperatureDataSerializer
from apps.climate_data.models import ClimateData, Indicator


class TemperatureAPIView(APIView):
    """
    年ごとの気温データを返すAPI（Upper/Lower/Global average）
    """

    def get(self, request):
        try:
            # Temperature グループの3つの指標を取得
            temperature_indicators = Indicator.objects.filter(
                group__name="Temperature",
                name__in=[
                    "Upper bound of the annual temperature anomaly (95% confidence interval)",
                    "Lower bound of the annual temperature anomaly (95% confidence interval)",
                    "Global average temperature anomaly relative to 1861-1890",
                ],
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
                serializer = TemperatureDataSerializer(qs, many=True)

                for item in serializer.data:
                    year = item["year"]
                    if year not in data_by_year:
                        data_by_year[year] = {"year": year}
                    # indicator.nameをキーにして値を格納
                    data_by_year[year][indicator.name] = item["value"]

            # 辞書をリスト化して返す
            sorted_data = [data_by_year[year] for year in sorted(data_by_year.keys())]
            return Response(sorted_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
