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
from .services import toggle_monitor
from .services import get_monitor_stats
from .services import get_monitor_checks
from .serializers import CheckResultSerializer

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


    def delete(self, request, monitor_id):
    
            result = delete_monitor(monitor_id=monitor_id, user=request.user)
    
            if result is None:
                return Response ({
                    "details": "Monitor not found"
                },status=status.HTTP_404_NOT_FOUND)
    
            return Response(
                status=status.HTTP_200_OK
            )

class MonitorToggleView(APIView):
    def post(self, request, monitor_id):
            monitor = toggle_monitor(
                monitor_id=monitor_id,
                user=request.user
            )
    
            if monitor is None:
                return Response(
                    {"details" : "Monitor is not found"}
                ,status=status.HTTP_404_NOT_FOUND)
    
            return Response(
                MonitorSerializer(monitor).data
            ,status=status.HTTP_200_OK)

class MonitorStatsView(APIView):
     permission_classes = [IsAuthenticated]

     def get(self, request, monitor_id):

        monitor = Monitor.objects.filter(
            id=monitor_id,
            owner=request.user
        ).first()

        if monitor is None:

            return Response (
                {"details" : "Monitor not found"}
            ,status=status.HTTP_404_NOT_FOUND)

        stats = get_monitor_stats(monitor)

        return Response (
             stats
        ,status=status.HTTP_200_OK)

class MonitorCheckView(APIView):

    permission_classes=[IsAuthenticated]

    def get(self, request, monitor_id):

        monitor = Monitor.objects.get(
            id=monitor_id,
            owner=request.user
        )

        if monitor is None:
            return Response(
                {"details" : "Monitor not found"}
            ,status=status.HTTP_404_NOT_FOUND)

        checks = get_monitor_checks(monitor, limit=50)

        serializer = CheckResultSerializer(
            checks,
            many=True,
        )

        return Response(
            serializer.data
        ,status=status.HTTP_200_OK)

    
    
     

