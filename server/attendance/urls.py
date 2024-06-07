from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'attendance_lists', views.AttendanceListViewSet, basename='attendance_lists')
router.register(r'lifeguard_attendance', views.LifeguardAttendanceViewSet)
router.register(r'staff_attendance', views.StaffAttendanceViewSet)

urlpatterns = [
  path('', include(router.urls)),
]