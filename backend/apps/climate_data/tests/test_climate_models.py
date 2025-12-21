import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region


@pytest.mark.django_db
class TestRegion:
    def test_create_region(self):
        region = Region.objects.create(
            name="Japan",
            code="JP",
        )
        assert region.name == "Japan"
        assert region.code == "JP"

    def test_str(self):
        region = Region.objects.create(name="Europe", code="EU")
        assert str(region) == "Europe"

    def test_generate_code_simple(self):
        code = Region.generate_code(entity="Japan")
        assert code == "AUTO_JAPAN"

    def test_generate_code_normalizes_entity(self):
        code = Region.generate_code(entity="  North America ")
        assert code == "AUTO_NORTH_AMERICA"


@pytest.mark.django_db
class TestIndicatorGroup:
    def test_create_indicator_group(self):
        group = IndicatorGroup.objects.create(
            name="Temperature",
            description="Temperature related indicators",
        )
        assert group.name == "Temperature"

    def test_str(self):
        group = IndicatorGroup.objects.create(name="CO2")
        assert str(group) == "CO2"


@pytest.mark.django_db
class TestIndicator:
    def test_create_indicator(self):
        group = IndicatorGroup.objects.create(name="Temperature")

        indicator = Indicator.objects.create(
            group=group,
            name="Mean temperature",
            unit="℃",
            description="Annual mean temperature",
            data_source_name="NOAA",
            data_source_url="https://example.com/source",
            metadata_url="https://example.com/meta",
        )

        assert indicator.group == group
        assert indicator.unit == "℃"
        assert indicator.data_source_name == "NOAA"

    def test_str(self):
        group = IndicatorGroup.objects.create(name="Temperature")
        indicator = Indicator.objects.create(
            group=group,
            name="Max temperature",
            unit="℃",
            data_source_name="NOAA",
            data_source_url="https://example.com/source",
        )

        assert str(indicator) == "Temperature - Max temperature"


@pytest.mark.django_db
class TestClimateData:
    def _create_base_objects(self):
        region = Region.objects.create(name="Japan", code="JP")
        group = IndicatorGroup.objects.create(name="Temperature")
        indicator = Indicator.objects.create(
            group=group,
            name="Mean temperature",
            unit="℃",
            data_source_name="NOAA",
            data_source_url="https://example.com/source",
        )
        return region, indicator

    def test_create_climate_data(self):
        region, indicator = self._create_base_objects()

        climate_data = ClimateData.objects.create(
            region=region,
            indicator=indicator,
            year=2020,
            value=15.6,
        )

        assert climate_data.year == 2020
        assert climate_data.value == 15.6

    def test_str(self):
        region, indicator = self._create_base_objects()
        climate_data = ClimateData.objects.create(
            region=region,
            indicator=indicator,
            year=2021,
            value=16.1,
        )

        expected_str = f"{region} - {indicator} (2021)"
        assert str(climate_data) == expected_str

    def test_unique_constraint(self):
        region, indicator = self._create_base_objects()

        ClimateData.objects.create(
            region=region,
            indicator=indicator,
            year=2020,
            value=15.0,
        )

        with pytest.raises(IntegrityError):
            ClimateData.objects.create(
                region=region,
                indicator=indicator,
                year=2020,
                value=15.5,
            )

    def test_year_validation_min(self):
        region, indicator = self._create_base_objects()

        # -10001 は下限未満なので ValidationError
        climate_data = ClimateData(
            region=region,
            indicator=indicator,
            year=-10001,
            value=10.0,
        )

        with pytest.raises(ValidationError):
            climate_data.full_clean()

    def test_year_validation_max(self):
        region, indicator = self._create_base_objects()

        # 10001 は上限超過なので ValidationError
        climate_data = ClimateData(
            region=region,
            indicator=indicator,
            year=10001,
            value=10.0,
        )

        with pytest.raises(ValidationError):
            climate_data.full_clean()
