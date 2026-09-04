from celery import shared_task

from .models import Monitor
from .services import check_monitor


@shared_task
def check_monitor_task(monitor_id):
    monitor = Monitor.objects.get(id=monitor_id)

    result = check_monitor(monitor)

    return result.id