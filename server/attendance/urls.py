from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'attendance', views.AttendanceViewSet)
router.register(r'lifeguard-attendance', views.LifeguardAttendanceViewSet)
router.register(r'staff-attendance', views.StaffAttendanceViewSet)

urlpatterns = [
  path('', include(router.urls)),
]