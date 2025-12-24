from unittest.mock import patch

import pytest
from django.core.management import call_command

from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region


@pytest.mark.django_db
@patch("apps.climate_data.management.commands.import_temperature.fetch_csv")
def test_temperature_import_creates_data(mock_fetch_csv, capsys):
    """
    Temperature import コマンドのテスト
    - IndicatorGroup
    - Indicator
    - Region
    - ClimateData
    が正しく作成されることを確認
    """

    # -----------------------------
    # モックCSVデータ
    # -----------------------------
    mock_fetch_csv.return_value = [
        {
            "Entity": "Japan",
            "Code": "JPN",
            "Year": "2020",
            "near_surface_temperature_anomaly": "0.98",
            "near_surface_temperature_anomaly_lower": "0.85",
            "near_surface_temperature_anomaly_upper": "1.12",
        },
        {
            "Entity": "Japan",
            "Code": "JPN",
            "Year": "2021",
            "near_surface_temperature_anomaly": "1.02",
            "near_surface_temperature_anomaly_lower": "0.90",
            "near_surface_temperature_anomaly_upper": "1.15",
        },
        # 不正な行（Year が数字でない）
        {
            "Entity": "Invalid",
            "Code": "INV",
            "Year": "20XX",
            "near_surface_temperature_anomaly": "1.0",
        },
    ]

    # -----------------------------
    # コマンド実行
    # -----------------------------
    call_command("import_temperature")

    # -----------------------------
    # IndicatorGroup
    # -----------------------------
    group = IndicatorGroup.objects.get(name="Temperature")
    assert group.description == "Temperature anomaly data"

    # -----------------------------
    # Indicator
    # -----------------------------
    indicator_main = Indicator.objects.get(
        group=group, name="Global average temperature anomaly"
    )
    assert indicator_main.unit == "°C"

    # -----------------------------
    # Region
    # -----------------------------
    region = Region.objects.get(code="JPN")
    assert region.name == "Japan"
    assert not Region.objects.filter(code="INV").exists()

    # -----------------------------
    # ClimateData
    # -----------------------------
    data_2020 = ClimateData.objects.get(
        region=region, indicator=indicator_main, year=2020
    )
    data_2021 = ClimateData.objects.get(
        region=region, indicator=indicator_main, year=2021
    )
    assert data_2020.value == 0.98
    assert data_2021.value == 1.02
    assert ClimateData.objects.count() == 6  # 3指標 × 2年

    # -----------------------------
    # stdout 出力確認
    # -----------------------------
    captured = capsys.readouterr()
    assert "created" in captured.out

    # -----------------------------
    # 再実行して更新されること
    # -----------------------------
    call_command("import_temperature")
    captured = capsys.readouterr()
    assert "updated" in captured.out
