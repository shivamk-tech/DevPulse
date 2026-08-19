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
            user=user
        )
    except Monitor.DoesNotExist:
        return None;
    for field, value in validated_data.items():
        setattr(monitor, field, value)

    monitor.save()

    return monitor

