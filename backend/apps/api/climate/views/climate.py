from rest_framework import viewsets

from apps.api.climate.serializers.climate import ClimateDataSerializer
from apps.climate_data.models import ClimateData


class ClimateDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClimateData.objects.all()
    serializer_class = ClimateDataSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        region_id = self.request.query_params.get("region")
        indicator_id = self.request.query_params.get("indicator")
        if region_id:
            queryset = queryset.filter(region_id=region_id)
        if indicator_id:
            queryset = queryset.filter(indicator_id=indicator_id)
        return queryset
