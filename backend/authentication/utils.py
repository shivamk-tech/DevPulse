from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth import get_user_model

email_verification_token = PasswordResetTokenGenerator()

def generate_verification_token(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_verification_token.make_token(user)

    return uid, token

def generate_verification_link(user):
    uid, token = generate_verification_token(user)

    return (
        f"{settings.BACKEND_URL}/api/auth/verify-email/"
        f"?uid={uid}&token={token}"
    )

User = get_user_model()

def get_user_uid(uid:str):
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        return User.objects.get(pk=user_id)
    except (User.DoesNotExist, ValueError, TypeError, OverflowError) :
        return None

def is_verification_token_valid(user, token):
    return email_verification_token.check_token(user, token)
