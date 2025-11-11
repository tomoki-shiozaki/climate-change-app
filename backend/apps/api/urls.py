from django.urls import path
from rest_framework.routers import SimpleRouter

from apps.api.views.climate import ClimateDataViewSet
from apps.api.views.temperature import TemperatureAPIView

router = SimpleRouter()
router.register(r"climate-data", ClimateDataViewSet, basename="climate-data")

urlpatterns = [
    path(
        "temperature/",
        TemperatureAPIView.as_view(),
        name="temperature-data",
    ),
]

urlpatterns = router.urls
