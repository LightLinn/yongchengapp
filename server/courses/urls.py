from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet)
router.register(r'course_types', views.CourseTypeViewSet)

urlpatterns = [
  path('', include(router.urls))  
]