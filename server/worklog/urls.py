# 創建urls.py 

from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import WorklogViewSet, SpecialCheckRecordViewSet, SpecialChecklistViewSet, PeriodicCheckRecordViewSet, PeriodicChecklistViewSet, DailyCheckRecordViewSet, DailyChecklistViewSet

router = DefaultRouter()
router.register(r'worklog', WorklogViewSet)
router.register(r'special_check_records', SpecialCheckRecordViewSet)
router.register(r'special_checklists', SpecialChecklistViewSet)
router.register(r'periodic_check_records', PeriodicCheckRecordViewSet)
router.register(r'periodic_checklists', PeriodicChecklistViewSet)
router.register(r'daily_checklists', DailyChecklistViewSet)
router.register(r'daily_check_records', DailyCheckRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
