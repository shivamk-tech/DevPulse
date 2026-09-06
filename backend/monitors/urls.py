from django.urls import path
from .views import MonitorListCreateView
from .views import MonitorDetailView
from .views import MonitorToggleView
from .views import MonitorStatsView
from .views import MonitorCheckView

urlpatterns = [
    path("", MonitorListCreateView.as_view(), name="monitor-list-create"),
    path("<int:monitor_id>/", MonitorDetailView.as_view(), name="monitor-detail"),
    path("<int:monitor_id>/toggle/", MonitorToggleView.as_view(), name="monitor-toggle"),
    path("<int:monitor_id>/stats/", MonitorStatsView.as_view(), name="monitor-stats"),
    path("<int:monitor_id>/checks/", MonitorCheckView.as_view(), name="monitor-checks"),
]
