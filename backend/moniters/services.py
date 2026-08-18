from .models import Moniters


def create_moniters(*, user, validated_data):
    return Moniters.objects.create(
        owner = user,
        **validated_data,
    )


def update_monitors(monitor_id, user, validated_data):
    try:
        monitor = Moniters.objects.get(
            id=monitor_id,
            user=user
        )
    except Moniters.DoesNotExist:
        return None;
    for field, value in validated_data.items():
        setattr(monitor, field, value)

    monitor.save()

    return monitor

