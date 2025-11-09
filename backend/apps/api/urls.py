from rest_framework.routers import SimpleRouter

from apps.api.views.climate import ClimateDataViewSet

router = SimpleRouter()
router.register(r"climate-data", ClimateDataViewSet, basename="climate-data")

urlpatterns = router.urls
