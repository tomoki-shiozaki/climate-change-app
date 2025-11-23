# utils/schema.py
try:
    from drf_spectacular.utils import extend_schema
except ModuleNotFoundError:
    # ダミーの extend_schema を定義
    def extend_schema(*args, **kwargs):
        def decorator(func):
            return func

        return decorator


def schema(summary: str, description: str = "", tags: list[str] | None = None):
    """
    extend_schema を簡略化するための共通ヘルパー
    Spectacular が無い場合はただの no-op decorator になる
    """
    return extend_schema(
        summary=summary,
        description=description,
        tags=tags,
    )
