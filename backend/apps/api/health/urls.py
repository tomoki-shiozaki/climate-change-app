from django.urls import path

from apps.api.health.views import ping

urlpatterns = [
    path("ping/", ping, name="ping"),
]
