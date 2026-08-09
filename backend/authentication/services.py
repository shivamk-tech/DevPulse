from django.db import IntegrityError, transaction
from rest_framework.exceptions import ValidationError
from .models import User
from .email_service import send_verification_email
from .utils import get_user_uid
from .utils import is_verification_token_valid
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.conf import settings
from .email_service import send_password_reset_email
from django.utils.encoding import force_str
 
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

def forget_password(email: str):

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return

    uid = urlsafe_base64_encode(force_bytes(user.pk))

    token = PasswordResetTokenGenerator().make_token(user)

    reset_link = (
        f"{settings.FRONTEND_URL}"
        f"/reset-passoword?uid={uid}&token={token}"
    )

    send_password_reset_email(
        user=user,
        reset_link=reset_link
    )

def reset_password(uid: str, token: str, password: str):

    try: 
        user_id = force_str(
            urlsafe_base64_decode(
                uid
            )
        )

        user = User.objects.get(pk=user_id)
    except(ValueError, TypeError, OverflowError, User.DoesNotExist):
        raise ValidationError({
            "token" : [
                "invalid or expired password reset link"
            ]
        })

    token_generator = PasswordResetTokenGenerator() 

    if not token_generator.check_token(user, token):
        raise ValidationError({
            "token" : [
                "invalid or expired password reset link"
            ]
        })

    user.set_password(password)
    user.save()

