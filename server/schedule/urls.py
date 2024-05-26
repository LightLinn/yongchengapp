# 創建urls.py 

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LifeguardScheduleViewSet

router = DefaultRouter()

router.register('lifeguard-schedule', LifeguardScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
