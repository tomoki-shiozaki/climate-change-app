import pytest

from apps.accounts.forms import CustomUserChangeForm, CustomUserCreationForm
from apps.accounts.models import CustomUser


@pytest.mark.django_db
class TestCustomUserCreationForm:
    def test_valid_data_creates_user(self):
        form = CustomUserCreationForm(
            data={
                "username": "testuser",
                "email": "test@example.com",
                "name": "Test User",
                "password1": "StrongPassword123!",
                "password2": "StrongPassword123!",
            }
        )

        assert form.is_valid(), form.errors

        user = form.save()

        assert isinstance(user, CustomUser)
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.name == "Test User"
        assert user.check_password("StrongPassword123!")

    def test_name_field_is_present(self):
        form = CustomUserCreationForm()
        assert "name" in form.fields

    def test_password_mismatch_is_invalid(self):
        form = CustomUserCreationForm(
            data={
                "username": "testuser",
                "email": "test@example.com",
                "name": "Test User",
                "password1": "StrongPassword123!",
                "password2": "DifferentPassword123!",
            }
        )

        assert not form.is_valid()
        assert "password2" in form.errors


@pytest.mark.django_db
class TestCustomUserChangeForm:
    def test_update_existing_user(self):
        user = CustomUser.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="password123",
            name="Old Name",
        )

        form = CustomUserChangeForm(
            instance=user,
            data={
                "username": "testuser",
                "email": "new@example.com",
                "name": "New Name",
            },
        )

        assert form.is_valid(), form.errors

        updated_user = form.save()

        assert updated_user.email == "new@example.com"
        assert updated_user.name == "New Name"

    def test_name_field_is_present(self):
        form = CustomUserChangeForm()
        assert "name" in form.fields
