from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from .utils import generate_verification_link


def _send_email(
    *,
    subject: str,
    template_name: str,
    context: dict,
    recipient: str,
):
    html_message = render_to_string(
        f"emails/{template_name}.html",
        context,
    )

    text_message = render_to_string(
        f"emails/{template_name}.txt",
        context,
    )

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
    )

    email.attach_alternative(html_message, "text/html")

    email.send()


def send_verification_email(user):
    verification_link = generate_verification_link(user)

    _send_email(
        subject="Verify your DevPulse account",
        template_name="verification",
        context={
            "user": user,
            "verification_link": verification_link,
        },
        recipient=user.email,
    )


def send_password_reset_email(user, reset_link):
    _send_email(
        subject="Reset your DevPulse password",
        template_name="password_reset",
        context={
            "user": user,
            "reset_link": reset_link,
        },
        recipient=user.email,
    )