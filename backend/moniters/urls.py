from django.urls import path
from .views import MoniterListCreateView

urlpatterns = [
    path("", MoniterListCreateView.as_view(), name="moniter-list-create")
]
