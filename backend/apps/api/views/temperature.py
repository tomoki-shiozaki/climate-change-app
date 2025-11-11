from rest_framework.response import Response
from rest_framework.views import APIView


class TemperatureDataAPIView(APIView):
    def get(self, request):
        # ダミーデータ
        data = [
            {"year": 2000, "base": 0.5, "upper": 0.7, "lower": 0.3},
            {"year": 2001, "base": 0.6, "upper": 0.8, "lower": 0.4},
        ]
        return Response(data)
