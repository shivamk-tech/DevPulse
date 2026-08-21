from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import MonitorSerializer
from .models import Monitor
from .services import create_monitor
from .serializers import MonitorEditSerializer
from .services import update_monitors
from .services import delete_monitor

# Create your views here.
class MonitorListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        monitors = request.user.monitors.all()
        serializer = MonitorSerializer(
            monitors,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        
        serializer = MonitorSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        monitor = create_monitor(
            user=request.user,
            validated_data=serializer.validated_data,
        )

        return Response(
            MonitorSerializer(monitor).data,
            status=status.HTTP_201_CREATED
        )

class MonitorDetailView(APIView):

    permission_classes=[IsAuthenticated]

    def patch(self, request, monitor_id):
        serializer = MonitorEditSerializer(data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        monitor = update_monitors(
            monitor_id=monitor_id,
            user=request.user,
            validated_data=serializer.validated_data,
        )

        if monitor is None:
            return Response({
                "details" : "Monitor not found"
            },status=status.HTTP_404_NOT_FOUND)

        return Response(
            MonitorSerializer(monitor).data
        ,status=status.HTTP_200_OK)

class MonitorDeleteView(APIView):

    permission_classes=[IsAuthenticated]

    def delete(self, request, monitor_id):

        result = delete_monitor(monitor_id=monitor_id, user=request.user)

        if result is None:
            return Response ({
                "details": "Monitor not found"
            },status=status.HTTP_404_NOT_FOUND)

        return Response(
            status=status.HTTP_200_OK
        )
    