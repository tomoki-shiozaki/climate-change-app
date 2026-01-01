from django.urls import path

from apps.api.health.views import PingView

urlpatterns = [
    path("ping/", PingView.as_view(), name="ping"),
]
