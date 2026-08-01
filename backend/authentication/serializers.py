from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from .models import User

class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=50,trim_whitespace=True)
    last_name = serializers.CharField(max_length=50,trim_whitespace=True)

    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    def validate_email(self, value):
        email=User.objects.normalize_email(value)

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("Account with this email already exists.")

        return email
    
    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm":"Passwords do not match."
            })
        return attrs
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True, 
        trim_whitespace=False
    )

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_email_verified",
        )