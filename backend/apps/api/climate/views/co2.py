from collections import defaultdict

from django.shortcuts import get_object_or_404
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.api.climate.serializers.co2 import CO2DataByYearSerializer
from apps.climate_data.constants import CLIMATE_GROUPS
from apps.climate_data.models import ClimateData, Indicator


class CO2DataByYearView(GenericAPIView):
    """
    フロント用 API
    /climate/co2-data/
    """

    serializer_class = CO2DataByYearSerializer

    def get_queryset(self):
        co2_info = CLIMATE_GROUPS["CO2"]
        group_name = co2_info["group"]["name"]
        name = co2_info["indicator"]["name"]

        indicator = get_object_or_404(
            Indicator,
            group__name=group_name,
            name=name,
        )

        return ClimateData.objects.filter(indicator=indicator).select_related("region")

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # 年・国コードごとにまとめる
        result = defaultdict(dict)
        for cd in queryset:
            result[cd.year][cd.region.code] = cd.value

        serializer = self.get_serializer({"co2_data": dict(result)})
        return Response(serializer.data)
