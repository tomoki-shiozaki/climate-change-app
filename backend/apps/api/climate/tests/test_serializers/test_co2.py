import pytest

from apps.api.climate.serializers.co2 import CO2DataByYearSerializer


@pytest.mark.django_db
class TestCO2DataByYearSerializer:
    def test_valid_data(self):
        """正しい構造のデータで serializer が通ること"""
        data = {
            "co2_data": {
                "2000": {"JPN": 1000.0, "USA": 5000.0},
                "2001": {"JPN": 1100.0, "USA": 5200.0},
            }
        }
        serializer = CO2DataByYearSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data == data

    def test_data_string_value(self):
        data = {"co2_data": {"2000": {"JPN": "1000", "USA": 5000.0}}}
        serializer = CO2DataByYearSerializer(data=data)
        assert serializer.is_valid()  # 文字列 "1000" は float に変換される

    def test_invalid_data_missing_year(self):
        """外側のキー（年）が欠損しても serializer は通る（DictField はキー必須ではない）"""
        data = {"co2_data": {}}
        serializer = CO2DataByYearSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data == data

    def test_invalid_data_missing_inner_key(self):
        """内側のキー（地域コード）が欠損しても DictField は空で通る"""
        data = {"co2_data": {"2000": {}}}
        serializer = CO2DataByYearSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data == data
