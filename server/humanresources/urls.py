from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('coaches', views.CoachViewSet)
router.register('lifeguards', views.LifeguardViewSet)
router.register('performances', views.PerformanceViewSet)
router.register('salaries', views.SalaryViewSet)
router.register('employees', views.EmployeeViewSet)

urlpatterns = [
  path('', include(router.urls))  
]