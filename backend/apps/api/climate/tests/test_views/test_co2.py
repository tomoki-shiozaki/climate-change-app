import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient

from apps.climate_data.constants import CLIMATE_GROUPS
from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region

pytestmark = pytest.mark.django_db


class TestCO2DataByYearView:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def setup_data(self, api_client):
        User = get_user_model()
        # カスタムユーザー作成＋認証
        user = User.objects.create_user(username="testuser", password="password")
        api_client.force_authenticate(user=user)

        # Region 作成
        jpn = Region.objects.create(name="Japan", code="JPN")
        usa = Region.objects.create(name="USA", code="USA")

        # IndicatorGroup 作成
        co2_info = CLIMATE_GROUPS["CO2"]
        group_name = co2_info["group"]["name"]
        indicator_name = co2_info["indicator"]["name"]
        group = IndicatorGroup.objects.create(name=group_name)

        # Indicator 作成
        indicator = Indicator.objects.create(name=indicator_name, group=group)

        # ClimateData 作成
        ClimateData.objects.create(
            indicator=indicator, region=jpn, year=2000, value=1000.0
        )
        ClimateData.objects.create(
            indicator=indicator, region=usa, year=2000, value=5000.0
        )
        ClimateData.objects.create(
            indicator=indicator, region=jpn, year=2001, value=1100.0
        )
        ClimateData.objects.create(
            indicator=indicator, region=usa, year=2001, value=5200.0
        )

        return {
            "user": user,
            "indicator": indicator,
            "regions": {"JPN": jpn, "USA": usa},
        }

    def test_get_co2_data(self, api_client, setup_data):
        url = reverse("co2-data")
        response = api_client.get(url)

        assert response.status_code == 200
        data = response.json()["co2_data"]

        assert data["2000"]["JPN"] == 1000.0
        assert data["2000"]["USA"] == 5000.0
        assert data["2001"]["JPN"] == 1100.0
        assert data["2001"]["USA"] == 5200.0

    def test_empty_data(self, api_client):

        # 認証ユーザーを作成してログイン
        User = get_user_model()
        user = User.objects.create_user(username="emptytest", password="password")
        api_client.force_authenticate(user=user)

        # Indicator が存在しない場合は 404
        url = reverse("co2-data")
        response = api_client.get(url)
        assert response.status_code == 404
