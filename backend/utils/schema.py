from typing import Any, Callable, TypeVar

F = TypeVar("F", bound=Callable[..., Any])

try:
    from drf_spectacular.utils import extend_schema
except ModuleNotFoundError:
    # 本番環境では drf-spectacular がなくても安全にする
    def extend_schema(*args, **kwargs) -> Callable[[F], F]:
        def decorator(func: F) -> F:
            return func

        return decorator


def schema(
    summary: str,
    description: str = "",
    tags: list[str] | None = None,
    responses: Any = None,
):
    """
    extend_schema を簡略化するための共通ヘルパー
    """
    return extend_schema(
        summary=summary,
        description=description,
        tags=tags,
        responses=responses,
    )
