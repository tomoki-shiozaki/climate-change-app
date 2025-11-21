from dj_rest_auth.views import LoginView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class CookieLoginView(LoginView):
    def get_response(self):
        # デフォルトのレスポンスを作成
        original_response = super().get_response()

        # simplejwt の refresh token 取得
        refresh = RefreshToken.for_user(self.user)  # type: ignore
        access = str(refresh.access_token)

        # Cookie にセット
        response = Response({"message": "ログイン成功"})
        response.set_cookie(
            key="my-app-auth",
            value=access,
            httponly=True,
            secure=True,  # HTTPS 本番環境では必須
            samesite="None",  # クロスオリジンでも送信される
        )
        response.set_cookie(
            key="my-refresh-token",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="None",
        )
        return response
