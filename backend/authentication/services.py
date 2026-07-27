from django.db import IntegrityError, transaction

from rest_framework.exceptions import ValidationError

from .models import User

def register_user(*, email, password, first_name, last_name):
    try:
        with transaction.atomic():
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
        return user
    except IntegrityError:
        raise ValidationError({
            "email":"this email already exists"
        })
