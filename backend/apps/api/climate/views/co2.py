from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.api.climate.serializers.co2 import CO2DataByYearSerializer
from apps.climate_data.models import ClimateData, Indicator


class CO2DataByYearView(GenericAPIView):
    """
    フロント用 API
    /co2-data/
    """

    serializer_class = CO2DataByYearSerializer

    def get_queryset(self):
        co2_group_info = settings.CLIMATE_GROUPS["CO2"]
        co2_group_name = co2_group_info["name"]
        co2_column_key = co2_group_info.get("column_key", "emissions_total")

        co2_indicator = get_object_or_404(
            Indicator,
            group__name=co2_group_name,
            name=co2_column_key,
        )

        return ClimateData.objects.filter(indicator=co2_indicator).select_related(
            "region"
        )

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # 年・国コードごとにまとめる
        result = {}
        for cd in queryset:
            year = cd.year
            iso = cd.region.iso_code
            if year not in result:
                result[year] = {}
            result[year][iso] = cd.value

        serializer = self.get_serializer({"co2_data": result})
        return Response(serializer.data)
