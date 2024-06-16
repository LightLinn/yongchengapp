# 創建urls.py 

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LifeguardScheduleViewSet, CoachScheduleViewSet, LocationViewSet, UnavailableSlotViewSet

router = DefaultRouter()

router.register(r'lifeguard_schedules', LifeguardScheduleViewSet)
router.register(r'coach_schedules', CoachScheduleViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'unavailable_slots', UnavailableSlotViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
