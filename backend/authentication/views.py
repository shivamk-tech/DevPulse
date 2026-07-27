from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SignupSerializer
from .services import register_user


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