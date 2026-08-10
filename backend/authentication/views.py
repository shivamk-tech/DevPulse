from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SignupSerializer
from .serializers import LoginSerializer
from .services import register_user
from .services import verify_email
from .services import login_user
from django.conf import settings
from django.shortcuts import redirect
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RefreshTokenSerializer
from .services import refresh_access_token
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import ForgotPasswordSerializer
from .services import forget_password
from .serializers import ResetPasswordSerializer
from .services import reset_password
from .serializers import ChangePasswordSerializer
from .services import change_password

class SignupView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        serializers = SignupSerializer(data=request.data)

        serializers.is_valid(raise_exception=True)

        data = serializers.validated_data

        user = register_user(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )

        return Response(
            {
                "message":"account created successfully",
                "user":UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )

class VerifyEmailView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]
    def get(self, request):
        uid = request.query_params.get("uid")
        token = request.query_params.get("token")

        try:
            verify_email(uid,token)

            return redirect(f"{settings.FRONTEND_URL}/login?verified=true")
        except Exception:
            return redirect(f"{settings.FRONTEND_URL}/login?verified=false")
        

class LoginView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result =  login_user(**serializer.validated_data)

        response =  Response({
            "user": UserSerializer(result['user']).data,
        },
        status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="access_token",
            value=result["access"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 15,
        )

        response.set_cookie(
            key="refresh_token",
            value=result["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60 * 24 * 7,
        )

        return response

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            UserSerializer(request.user).data
        )


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post (self, request):
        serializer = RefreshTokenSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)

        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token is None:
            return Response(
                {"details" : "Refresh token not found"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:

            new_access_token = refresh_access_token(refresh_token)

            response = Response(
                {"message" : "Access token refreshed successfully."},
                status=status.HTTP_200_OK
            )
        

            response.set_cookie(
                key="access_token",
                value=new_access_token,
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=60 * 15,
            )

            return response
        except TokenError:
            return response(
                {
                    "details" : "Refresh token is invalid or expired. " 
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LogoutView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        response = Response(
            {
                "message" : "Logged out successfully"
            },
            status=status.HTTP_200_OK
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializers = ForgotPasswordSerializer(data=request.data)

        serializers.is_valid(raise_exception=True)

        forget_password(serializers.validated_data["email"])

        return Response(
            {
                "details" : "A password reset link has been sent on the given email address"
            },
            status=status.HTTP_200_OK
        )

class ResetPasswordView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        reset_password(
            uid=serializer.validated_data["uid"],
            token=serializer.validated_data["token"],
            password=serializer.validated_data["password"]
        )

        return Response({
            "details" : "Password reset successfull"
        },status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        change_password(
            user=request.user,
            current_password=serializer.validated_data["current_password"],
            password=serializer.validated_data["password"]
        )

        return Response({
            "message" : "Password changed succesfully"
        },status=status.HTTP_200_OK)



    
        