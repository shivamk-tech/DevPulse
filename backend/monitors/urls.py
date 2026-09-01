from django.urls import path
from .views import MonitorListCreateView
from .views import MonitorDetailView
from .views import MonitorToggleView

urlpatterns = [
    path("", MonitorListCreateView.as_view(), name="monitor-list-create"),
    path("<int:monitor_id>/", MonitorDetailView.as_view(), name="monitor-detail"),
    path("<int:monitor_id>/toggle/", MonitorToggleView.as_view(), name="monitor-toggle")
]
