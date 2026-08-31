from .models import Monitor


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
            monitor_id,
            user
        )

        monitor.is_active = not monitor.is_active
        monitor.save()

        return True
    except Monitor.DoesNotExist:
        return False


