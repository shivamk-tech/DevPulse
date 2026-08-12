from rest_framework import serializers
from .models import Moniters


class MonitersSerializers(serializers.ModelSerializer):

    class Meta:
        model = Moniters

        fields = [
            "id",
            "name",
            "url",
            "method",
            "interval",
            "timeout",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_field = [
            "id",
            "created_at",
            "updated_at",
        ]