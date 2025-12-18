from django.urls import path

from apps.api.climate.views.co2 import CO2DataByYearView
from apps.api.climate.views.temperature import TemperatureAPIView

urlpatterns = [
    path(
        "temperature/",
        TemperatureAPIView.as_view(),
        name="temperature-data",
    ),
    path(
        "co2-data/",
        CO2DataByYearView.as_view(),
        name="co2-data",
    ),
]
