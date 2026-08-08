from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from .utils import generate_verification_token
from .utils import generate_verification_link

def send_verification_email(user):
    verification_link = generate_verification_link(user)

    subject = "Verify your email verification"

    message = f"""
Hi {user.first_name},

Welcome to Beacon!

Please verify your email by clicking the link below:

{verification_link}

If you didn't create this account, you can safely ignore this email.

- Beacon Team
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )

def send_password_reset_email(user, reset_link):
    subject = "Reset your Beacon Password"

    context = {
        "user": user,
        "reset_link": reset_link,
    }

    html_message = render_to_string(
        "emails/password_reset.html",
        context,
    )

    text_message = render_to_string(
        "emails/password_reset.txt",
        context,
    )

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_USER,
        to=[user.email],
    )

    email.attach_alternative(html_message, "text/html")
    email.send()