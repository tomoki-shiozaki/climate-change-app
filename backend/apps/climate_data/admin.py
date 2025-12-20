from django.contrib import admin

from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region


class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")


class IndicatorGroupAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


class IndicatorAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "unit", "data_source_name")
    list_filter = ("group",)
    search_fields = ("name",)


class ClimateDataAdmin(admin.ModelAdmin):
    list_display = ("region", "indicator", "year", "value", "updated_at")
    list_filter = ("indicator", "region")
    search_fields = ("region__name", "indicator__name")
    ordering = ("indicator", "region", "year")
    readonly_fields = ("updated_at",)


admin.site.register(Region, RegionAdmin)
admin.site.register(IndicatorGroup, IndicatorGroupAdmin)
admin.site.register(Indicator, IndicatorAdmin)
admin.site.register(ClimateData, ClimateDataAdmin)
