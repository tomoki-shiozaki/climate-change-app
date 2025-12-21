CLIMATE_GROUPS = {
    "TEMPERATURE": {
        "name": "Temperature",
        "description": "Temperature anomaly data from Our World in Data",
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
            "csv_url": "https://ourworldindata.org/grapher/annual-co-emissions-by-region.csv?v=1&csvType=full&useColumnShortNames=true",
            # meta_url は保持するならここ
            "meta_url": "https://ourworldindata.org/grapher/annual-co-emissions-by-region.metadata.json?v=1&csvType=full&useColumnShortNames=true",
        },
    },
}
