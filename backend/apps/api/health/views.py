from rest_framework import serializers
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


class PingSerializer(serializers.Serializer):
    message = serializers.CharField()


class PingView(GenericAPIView):
    serializer_class = PingSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        """ウォームアップ用 ping"""
        return Response({"message": "pong"})
