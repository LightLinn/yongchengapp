# 創建urls.py 

from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import WorklogViewSet, SpecialCheckRecordViewSet, PeriodicCheckRecordViewSet, DailyCheckRecordViewSet

router = DefaultRouter()
router.register(r'worklog', WorklogViewSet)
router.register(r'special_check_record', SpecialCheckRecordViewSet)
router.register(r'periodic_check_record', PeriodicCheckRecordViewSet)
router.register(r'daily_check_record', DailyCheckRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
