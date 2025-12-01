from django.contrib import admin

from apps.climate_data.models import ClimateData, Indicator, IndicatorGroup, Region


class ClimateDataAdmin(admin.ModelAdmin):
    list_display = ("region", "indicator", "year", "value", "fetched_at")
    list_filter = ("indicator", "region")
    search_fields = ("region__name", "indicator__name")
    ordering = ("indicator", "region", "year")
    readonly_fields = ("fetched_at",)  # 追加


class IndicatorAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "unit", "data_source_name", "fetched_at")
    list_filter = ("group",)
    search_fields = ("name",)
    readonly_fields = ("fetched_at",)  # 追加


class IndicatorGroupAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "iso_code")
    search_fields = ("name", "iso_code")


admin.site.register(ClimateData, ClimateDataAdmin)
admin.site.register(Indicator, IndicatorAdmin)
admin.site.register(IndicatorGroup, IndicatorGroupAdmin)
admin.site.register(Region, RegionAdmin)
