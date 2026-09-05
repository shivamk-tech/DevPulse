from .models import Monitor, CheckResult
import requests
import time 
from django.utils import timezone

def create_monitor(*, user, validated_data):
    return Monitor.objects.create(
        owner = user,
        **validated_data,
    )

def update_monitors(monitor_id, user, validated_data):
    try:
        monitor = Monitor.objects.get(
            id=monitor_id,
            owner=user
        )
    except Monitor.DoesNotExist:
        return None;

    for field, value in validated_data.items():
        setattr(monitor, field, value)

    monitor.save()

    return monitor

def delete_monitor(monitor_id, user):
    try:
        monitor = Monitor.objects.get(
            id=monitor_id,
            owner=user
        )
        monitor.delete()
        return True

    
    except Monitor.DoesNotExist:
        return None;

def toggle_monitor(monitor_id, user):
    try:
        monitor = Monitor.objects.get(
            id=monitor_id,
            owner=user
        )

        monitor.is_active = not monitor.is_active
        monitor.save()

        return monitor
    except Monitor.DoesNotExist:
        return False

def check_monitor(monitor):
    start_time = time.perf_counter()

    try:
        response = requests.request(
            method=monitor.method,
            url=monitor.url,
            timeout=monitor.timeout,
        )

        end_time = time.perf_counter()

        response_time = (end_time - start_time) * 1000

        success = 200 <= response.status_code < 400

        check_result = CheckResult.objects.create(
            monitor=monitor,
            status_code=response.status_code,
            response_time=response_time,
            success=success,
            error=None,
        )

        monitor.last_checked_at = timezone.now()
        monitor.save(update_fields=["last_checked_at"])

        return check_result

    except requests.RequestException as error:

        end_time = time.perf_counter()

        response_time = (end_time - start_time) * 1000

        check_result = CheckResult.objects.create(
            monitor=monitor,
            status_code=None,
            response_time=response_time,
            success=False,
            error=str(error),
        )

        monitor.last_checked_at = timezone.now()
        monitor.save(update_fields=["last_checked_at"])

        return check_result