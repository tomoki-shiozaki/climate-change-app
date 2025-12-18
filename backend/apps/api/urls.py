from django.urls import include, path

urlpatterns = [
    path("climate/", include("apps.api.climate.urls")),
]
