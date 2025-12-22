CLIMATE_GROUPS = {
    "TEMPERATURE": {
        "group": {
            "name": "Temperature",
            "description": "Temperature anomaly data",
        },
        "source": {
            "data_source_name": "Our World in Data",
            "data_source_url": "https://ourworldindata.org/grapher/temperature-anomaly",
            "csv_url": (
                "https://ourworldindata.org/grapher/temperature-anomaly.csv"
                "?v=1&csvType=full&useColumnShortNames=true"
            ),
            "meta_url": (
                "https://ourworldindata.org/grapher/temperature-anomaly.metadata.json"
                "?v=1&csvType=full&useColumnShortNames=true"
            ),
        },
        "indicators": {
            "near_surface_temperature_anomaly": {
                "name": "Global average temperature anomaly",
                "unit": "°C",
                "description": (
                    "Global average temperature anomaly relative to 1861–1890."
                ),
            },
            "near_surface_temperature_anomaly_lower": {
                "name": "Temperature anomaly (lower bound)",
                "unit": "°C",
                "description": (
                    "Lower bound of the annual temperature anomaly "
                    "(95% confidence interval)."
                ),
            },
            "near_surface_temperature_anomaly_upper": {
                "name": "Temperature anomaly (upper bound)",
                "unit": "°C",
                "description": (
                    "Upper bound of the annual temperature anomaly "
                    "(95% confidence interval)."
                ),
            },
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
