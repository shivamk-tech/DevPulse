from django.urls import path
from .views import MonitorListCreateView
from .views import MonitorDetailView

urlpatterns = [
    path("", MonitorListCreateView.as_view(), name="monitor-list-create"),
    path("<int:monitor_id>/", MonitorDetailView.as_view(), name="monitor-detail"),

]
