from typing import Optional


def parse_float(value_raw) -> Optional[float]:
    """
    CSV 由来の値を安全に float に変換する。

    - None / 空文字 / 不正文字列 → None
    - NaN → None
    """
    try:
        value = float(value_raw)
    except (TypeError, ValueError):
        return None

    # NaN チェック
    if value != value:
        return None

    return value
