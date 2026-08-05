from django.urls import path

from .views import SignupView
from .views import VerifyEmailView
from .views import LoginView
from .views import CurrentUserView
from .views import RefreshTokenView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", CurrentUserView.as_view(), name="current_user"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh"),
]