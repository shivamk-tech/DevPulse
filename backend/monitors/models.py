from django.db import models

# Create your models here.
from django.conf import settings
from django.db import models


class Monitor(models.Model):

    class HttpMethod(models.TextChoices):
        GET = "GET", "GET"
        HEAD = "HEAD", "HEAD"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="monitors"
    )

    name = models.CharField(
        max_length=100,
    )

    url = models.URLField(
        max_length=100,
    )

    method = models.CharField(
        max_length=10,
        choices=HttpMethod.choices,
        default=HttpMethod.GET
    )

    interval = models.PositiveIntegerField(
        default=60,
        help_text="Monitoring interval in seconds.",
    )

    timeout = models.PositiveIntegerField(
        default=10,
        help_text="Request timeout in seconds.",
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name

class CheckResult(models.Model):
    monitor = models.ForeignKey(
        Monitor,
        on_delete=models.CASCADE,
        related_name="check_result"
    )

    status_code=models.PositiveIntegerField(
        null=True,
        blank=True
    )

    response_time = models.FloatField(
        null=True,
        blank=True
    )

    success = models.BooleanField()


    error = models.TextField(
        null=True,
        blank=True
    )

    checked_at = models.DateTimeField(
        auto_now_add=True
    )