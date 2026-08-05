from django.db import IntegrityError, transaction
from rest_framework.exceptions import ValidationError
from .models import User
from .email_service import send_verification_email
from .utils import get_user_uid
from .utils import is_verification_token_valid
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

def register_user(*, email, password, first_name, last_name):
    try:
        with transaction.atomic():
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
        send_verification_email(user)

        return user
    except IntegrityError:
        raise ValidationError({
            "email":"this email already exists"
        })

def verify_email(uid: str, token: str):

    user = get_user_uid(uid)

    if user is None:
        raise ValidationError({
                    "detail": "Invalid verification link."
                })

    if not is_verification_token_valid(user, token):
        raise ValidationError({
                    "detail": "Invalid verification link."
})

    if user.is_email_verified:
        return user

    user.is_email_verified = True
    user.save(update_fields=["is_email_verified"])

    return user


def login_user(*, email, password):
    user = authenticate(
        email=email, 
        password=password,
    )

    if user is None:
        raise ValidationError({
            "details": "Invalid email or password"
        })

    if not user.is_email_verified:
        raise ValidationError({
            "details":"Verify email first"
        })

    refresh = RefreshToken.for_user(user)

    access = refresh.access_token

    return {
        "user":user,
        "access":str(access),
        "refresh":str(refresh),
    }


def refresh_access_token(refresh_token: str):
    refresh = RefreshToken(refresh_token)

    access = refresh.access_token

    return str(access)

