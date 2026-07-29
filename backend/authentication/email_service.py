from django.core.mail import send_mail
from django.conf import settings

from .utils import generate_verification_token
from .utils import generate_verification_link

def send_verification_email(user):
    verification_link = generate_verification_link(user)

    subject = "Verify your email verification"

    message = f"""
Hi {user.first_name},

Welcome to DevPulse!

Please verify your email by clicking the link below:

{verification_link}

If you didn't create this account, you can safely ignore this email.

- DevPulse Team
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )