import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.climate_data.constants import CLIMATE_GROUPS
from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region

User = get_user_model()


@pytest.mark.django_db
class TestTemperatureAPIView:
    # ===============================
    # 🔹 API クライアント（強制認証）
    # ===============================
    @pytest.fixture
    def api_client(self):
        user = User.objects.create_user(
            username="testuser",
            password="password123",
        )
        client = APIClient()
        client.force_authenticate(user=user)
        return client

    # ===============================
    # 🔹 URL
    # ===============================
    @pytest.fixture
    def url(self):
        return reverse("temperature-data")

    # ===============================
    # 🔹 IndicatorGroup
    # ===============================
    @pytest.fixture
    def temperature_group(self):
        group_name = CLIMATE_GROUPS["TEMPERATURE"]["group"]["name"]
        return IndicatorGroup.objects.create(name=group_name)

    # ===============================
    # 🔹 Indicators（3種）
    # ===============================
    @pytest.fixture
    def indicators(self, temperature_group):
        defs = CLIMATE_GROUPS["TEMPERATURE"]["indicators"]

        base_kwargs = {
            "group": temperature_group,
            "unit": "°C",
            "data_source_name": "OWID",
            "data_source_url": "https://ourworldindata.org/",
        }

        return [
            Indicator.objects.create(
                name=defs["near_surface_temperature_anomaly_upper"]["name"],
                **base_kwargs,
            ),
            Indicator.objects.create(
                name=defs["near_surface_temperature_anomaly_lower"]["name"],
                **base_kwargs,
            ),
            Indicator.objects.create(
                name=defs["near_surface_temperature_anomaly"]["name"],
                **base_kwargs,
            ),
        ]

    # ===============================
    # 🔹 Regions
    # ===============================
    @pytest.fixture
    def regions(self):
        return [
            Region.objects.create(name="World", code="OWID_WRL"),
            Region.objects.create(
                name="Northern Hemisphere",
                code="OWID_NH",
            ),
        ]

    # ===============================
    # 🔹 ClimateData
    # ===============================
    @pytest.fixture
    def climate_data(self, indicators, regions):
        for region in regions:
            for year in [1900, 1901]:
                for indicator in indicators:
                    ClimateData.objects.create(
                        region=region,
                        indicator=indicator,
                        year=year,
                        value=1.23,
                    )

    # ===============================
    # ✅ 正常系
    # ===============================
    def test_success_response(
        self,
        api_client,
        url,
        indicators,
        regions,
        climate_data,
    ):
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        body = response.json()

        # region がトップレベルキー
        assert "World" in body
        assert "Northern Hemisphere" in body

        world_data = body["World"]

        assert isinstance(world_data, list)
        assert len(world_data) == 2

        first = world_data[0]
        assert first["year"] == 1900
        assert "upper" in first
        assert "lower" in first
        assert "global_average" in first

    # ===============================
    # ❌ 異常系：Indicator 不足
    # ===============================
    def test_missing_indicator_returns_404(
        self,
        api_client,
        url,
        temperature_group,
    ):
        # 3つ揃えず、1つだけ作る
        Indicator.objects.create(
            name="dummy indicator",
            group=temperature_group,
            unit="°C",
            data_source_name="OWID",
            data_source_url="https://ourworldindata.org/",
        )

        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json()["detail"] == "Not all temperature indicators found."
