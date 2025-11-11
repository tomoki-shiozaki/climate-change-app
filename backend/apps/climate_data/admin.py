from django.contrib import admin

from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region

# Register your models here.
admin.site.register(ClimateData)
admin.site.register(Indicator)
admin.site.register(IndicatorGroup)
admin.site.register(Region)
