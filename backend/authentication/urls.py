from django.urls import path

from .views import SignupView
from .views import VerifyEmailView
from .views import LoginView
from .views import CurrentUserView
from .views import RefreshTokenView
from .views import LogoutView
from .views import ForgotPasswordView
from .views import ResetPasswordView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", CurrentUserView.as_view(), name="current_user"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forget-password"),
    path("reset-password/", ResetPasswordView.as_view, name="reset-password"),
]