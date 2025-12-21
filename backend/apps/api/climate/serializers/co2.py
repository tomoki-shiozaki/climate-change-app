from rest_framework import serializers


class CO2DataByYearSerializer(serializers.Serializer):
    """
    年ごとの国別CO2排出量を返すSerializer。

    co2_data の構造例:
    {
        "2000": { "JPN": 1000.0, "USA": 5000.0 },
        "2001": { "JPN": 1100.0, "USA": 5200.0 }
    }
    - 外側のキー: 年（year）
    - 内側のキー: 地域コード
    - 内側の値: CO2排出量（tonnes）
    """

    co2_data = serializers.DictField(
        child=serializers.DictField(child=serializers.FloatField()),
        help_text=(
            "年ごとの国別CO2排出量。例: " "{ '2000': {'JPN': 1000.0, 'USA': 5000.0} }"
        ),
    )
