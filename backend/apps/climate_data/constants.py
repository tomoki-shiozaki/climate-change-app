CLIMATE_GROUPS = {
    "TEMPERATURE": {
        "group": {
            "name": "Temperature",
            "description": "Temperature anomaly data from Our World in Data",
        },
        "indicator": {
            # 温度データはメタデータに列ごとに情報があるので、
            # 固定の column_key は設定しないか、代表列を入れる
            "name": "Global average temperature anomaly",
            "unit": "°C",
            "description": (
                "The difference in average land-sea surface temperature "
                "compared to the 1861-1890 mean."
            ),
            # 代表列の shortName を入れておく
            "column_key": "near_surface_temperature_anomaly",
            "data_source_name": "Our World in Data",
            "data_source_url": "https://ourworldindata.org/grapher/temperature-anomaly",
        },
        "source": {
            "csv_url": (
                "https://ourworldindata.org/grapher/temperature-anomaly.csv"
                "?v=1&csvType=full&useColumnShortNames=true"
            ),
            "meta_url": (
                "https://ourworldindata.org/grapher/temperature-anomaly.metadata.json"
                "?v=1&csvType=full&useColumnShortNames=true"
            ),
        },
    },
    "CO2": {
        "group": {
            "name": "CO₂ Emissions",
            "description": "Carbon dioxide emissions",
        },
        "indicator": {
            "name": "Total CO₂ emissions",
            "unit": "tonnes",
            "description": (
                "Annual total emissions of carbon dioxide (CO₂), "
                "excluding land-use change."
            ),
            "column_key": "emissions_total",
            "data_source_name": "Our World in Data",
            "data_source_url": "https://ourworldindata.org/co2-emissions",
        },
        "source": {
            "csv_url": (
                "https://ourworldindata.org/grapher/annual-co-emissions-by-region.csv"
                "?v=1&csvType=full&useColumnShortNames=true"
            ),
            "meta_url": (
                "https://ourworldindata.org/grapher/annual-co-emissions-by-region.metadata.json"
                "?v=1&csvType=full&useColumnShortNames=true"
            ),
        },
    },
}
