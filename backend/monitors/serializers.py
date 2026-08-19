from rest_framework import serializers
from .models import Monitor


class MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Monitor

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

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

class MonitorEditSerializer(serializers.Serializer):
    name = serializers.CharField(
        min_length=1
    )

    url = serializers.URLField()

    method = serializers.ChoiceField(
        choices = ["GET", "PUT", "PATCH", "POST", "HEAD", "DELETE"]
    )

    interval = serializers.IntegerField()

    timeout = serializers.IntegerField()

