import pytest

from apps.climate_data.utils.parse_helpers import parse_float, parse_year

# =========================
# parse_float のテスト
# =========================


@pytest.mark.parametrize(
    "value_raw, expected",
    [
        (1, 1.0),
        (1.23, 1.23),
        ("1", 1.0),
        ("1.23", 1.23),
        (" 2.5 ", 2.5),
        (0, 0.0),
        ("0", 0.0),
    ],
)
def test_parse_float_valid(value_raw, expected):
    assert parse_float(value_raw) == expected


@pytest.mark.parametrize(
    "value_raw",
    [
        None,
        "",
        "abc",
        "1,23",
        {},
        [],
    ],
)
def test_parse_float_invalid(value_raw):
    assert parse_float(value_raw) is None


@pytest.mark.parametrize(
    "value_raw",
    [
        float("nan"),
        "NaN",
        "nan",
    ],
)
def test_parse_float_nan(value_raw):
    assert parse_float(value_raw) is None


# =========================
# parse_year のテスト
# =========================


@pytest.mark.parametrize(
    "value_raw, expected",
    [
        (2020, 2020),
        ("2020", 2020),
        (" 1999 ", 1999),
        (0, 0),
        ("0", 0),
    ],
)
def test_parse_year_valid(value_raw, expected):
    assert parse_year(value_raw) == expected


@pytest.mark.parametrize(
    "value_raw",
    [
        None,
        "",
        "abc",
        "20.5",
        "NaN",
        float("nan"),
        {},
        [],
    ],
)
def test_parse_year_invalid(value_raw):
    assert parse_year(value_raw) is None
