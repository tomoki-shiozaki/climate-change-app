from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.accounts.forms import CustomUserChangeForm, CustomUserCreationForm
from apps.accounts.models import CustomUser


# Register your models here.
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = [
        "username",
        "email",
        "name",
        "is_staff",
    ]
    fieldsets = list(UserAdmin.fieldsets) + [(None, {"fields": ("name",)})]
    add_fieldsets = [
        (None, {"fields": ("username", "email", "password1", "password2", "name")})
    ]


admin.site.register(CustomUser, CustomUserAdmin)
