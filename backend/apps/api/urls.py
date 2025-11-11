from django.urls import path

from apps.api.views.temperature import TemperatureAPIView

urlpatterns = [
    path(
        "temperature/",
        TemperatureAPIView.as_view(),
        name="temperature-data",
    ),
]
