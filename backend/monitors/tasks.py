from celery import shared_task
from django.utils import timezone
from datetime import timedelta

from .models import Monitor
from .services import check_monitor


@shared_task
def check_monitor_task(monitor_id):
    monitor = Monitor.objects.get(id=monitor_id)

    result = check_monitor(monitor)

    return result.id


@shared_task
def schedule_monitor_checks():
    now = timezone.now()

    monitors = Monitor.objects.filter(
        is_active=True
    )

    for monitor in monitors:

        if monitor.last_checked_at is None:
            check_monitor_task.delay(monitor.id)
            continue

        next_check_at = (
            monitor.last_checked_at
            + timedelta(seconds=monitor.interval)
        )

        if next_check_at <= now:
            check_monitor_task.delay(monitor.id)