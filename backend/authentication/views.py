from django.shortcuts import render

# Create your views here.
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

class SignupView(APIView):
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
                "user":{
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "is_email_verified": user.is_email_verified
                },
            },
            status=status.HTTP_201_CREATED,
        )

class VerifyEmailView(APIView):
    def get(self, request):
        uid = request.query_params.get("uid")
        token = request.query_params.get("token")

        try:
            verify_email(uid,token)

            return redirect(f"{settings.FRONTEND_URL}/login?verified=true")
        except Exception:
            return redirect(f"{settings.FRONTEND_URL}/login?verified=false")
        

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result =  login_user(**serializer.validated_data)

        return Response({
            "access": result["access"],
            "refresh": result["refresh"],
            "user": {
                "id": result["user"].id,
                "email": result["user"].email,
                "first_name": result["user"].first_name,
                "last_name": result["user"].last_name,
                "is_email_verified": result["user"].is_email_verified,
        },
        },
        status=status.HTTP_200_OK
        )