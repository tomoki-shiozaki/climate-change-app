from unittest.mock import patch

import pytest
from django.core.management import call_command

from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region


@pytest.mark.django_db
@patch("apps.climate_data.management.commands.import_co2.fetch_csv")
def test_import_creates_regions_indicators_and_climate_data(mock_fetch_csv):
    """
    CO2 インポートコマンドが
    - IndicatorGroup
    - Indicator
    - Region
    - ClimateData
    を正しく作成することを確認
    """

    # -------------------------
    # モック CSV データ
    # -------------------------
    mock_fetch_csv.return_value = [
        {
            "Entity": "World",
            "Code": "OWID_WRL",
            "Year": "2020",
            "emissions_total": "35000000000",
        },
        {
            "Entity": "Japan",
            "Code": "JPN",
            "Year": "2020",
            "emissions_total": "1060000000",
        },
        # 不正な行（Year が数字でない）
        {
            "Entity": "Invalid",
            "Code": "INV",
            "Year": "20XX",
            "emissions_total": "123",
        },
    ]

    # -------------------------
    # コマンド実行
    # -------------------------
    call_command("import_co2")

    # -------------------------
    # IndicatorGroup
    # -------------------------
    group = IndicatorGroup.objects.get(name="CO₂ Emissions")
    assert group.description == "Carbon dioxide emissions"

    # -------------------------
    # Indicator
    # -------------------------
    indicator = Indicator.objects.get(group=group)
    assert indicator.name == "Total CO₂ emissions"
    assert indicator.unit == "tonnes"
    assert "carbon dioxide" in indicator.description.lower()

    # -------------------------
    # Region
    # -------------------------
    assert Region.objects.filter(code="OWID_WRL").exists()
    assert Region.objects.filter(code="JPN").exists()
    assert not Region.objects.filter(code="INV").exists()

    # -------------------------
    # ClimateData
    # -------------------------
    world = Region.objects.get(code="OWID_WRL")
    japan = Region.objects.get(code="JPN")

    world_data = ClimateData.objects.get(
        region=world,
        indicator=indicator,
        year=2020,
    )
    assert world_data.value == 35000000000

    japan_data = ClimateData.objects.get(
        region=japan,
        indicator=indicator,
        year=2020,
    )
    assert japan_data.value == 1060000000

    # 不正な行は入らない
    assert ClimateData.objects.count() == 2


@pytest.mark.django_db
@patch("apps.climate_data.management.commands.import_co2.fetch_csv")
def test_import_updates_existing_data(mock_fetch_csv):
    """
    既存 ClimateData がある場合、値が更新されることを確認
    """

    # -------------------------
    # 事前データ作成
    # -------------------------
    group = IndicatorGroup.objects.create(
        name="CO₂ Emissions",
        description="Carbon dioxide emissions",
    )
    indicator = Indicator.objects.create(
        group=group,
        name="Total CO₂ emissions",
        unit="tonnes",
    )
    region = Region.objects.create(
        name="Japan",
        code="JPN",
    )
    ClimateData.objects.create(
        region=region,
        indicator=indicator,
        year=2020,
        value=100,
    )

    # -------------------------
    # CSV 側の更新データ
    # -------------------------
    mock_fetch_csv.return_value = [
        {
            "Entity": "Japan",
            "Code": "JPN",
            "Year": "2020",
            "emissions_total": "200",
        }
    ]

    # -------------------------
    # 実行
    # -------------------------
    call_command("import_co2")

    # -------------------------
    # 更新確認
    # -------------------------
    cd = ClimateData.objects.get(region=region, year=2020)
    assert cd.value == 200


@pytest.mark.django_db
@patch("apps.climate_data.management.commands.import_co2.fetch_csv")
def test_import_does_not_update_when_value_is_same(mock_fetch_csv):
    """
    既存 ClimateData と同じ値の場合、更新されないことを確認
    """

    group = IndicatorGroup.objects.create(
        name="CO₂ Emissions",
        description="Carbon dioxide emissions",
    )
    indicator = Indicator.objects.create(
        group=group,
        name="Total CO₂ emissions",
        unit="tonnes",
    )
    region = Region.objects.create(
        name="Japan",
        code="JPN",
    )
    ClimateData.objects.create(
        region=region,
        indicator=indicator,
        year=2020,
        value=200,
    )

    mock_fetch_csv.return_value = [
        {
            "Entity": "Japan",
            "Code": "JPN",
            "Year": "2020",
            "emissions_total": "200",
        }
    ]

    call_command("import_co2")

    cd = ClimateData.objects.get(region=region, year=2020)
    assert cd.value == 200
    assert ClimateData.objects.count() == 1


@pytest.mark.django_db
@patch("apps.climate_data.management.commands.import_co2.fetch_csv")
@patch(
    "apps.climate_data.management.commands.import_co2.ClimateData.objects.bulk_update"
)
def test_import_does_not_call_bulk_update_when_value_same(
    mock_bulk_update, mock_fetch_csv
):
    """
    値が変わらない場合に bulk_update が呼ばれないことを確認する。
    パフォーマンス最適化のリグレッション防止用テスト。
    """
    group = IndicatorGroup.objects.create(
        name="CO₂ Emissions",
        description="Carbon dioxide emissions",
    )
    indicator = Indicator.objects.create(
        group=group,
        name="Total CO₂ emissions",
        unit="tonnes",
    )
    region = Region.objects.create(name="Japan", code="JPN")
    ClimateData.objects.create(
        region=region,
        indicator=indicator,
        year=2020,
        value=200,
    )

    mock_fetch_csv.return_value = [
        {
            "Entity": "Japan",
            "Code": "JPN",
            "Year": "2020",
            "emissions_total": "200",
        }
    ]

    call_command("import_co2")

    mock_bulk_update.assert_not_called()
