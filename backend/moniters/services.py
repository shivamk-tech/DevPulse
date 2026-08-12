from .models import Moniters


def create_moniters(*, user, validated_data):
    return Moniters.object.create(
        owner = user,
        **validated_data,
    )
