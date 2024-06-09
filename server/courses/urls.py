from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet)
router.register(r'course_types', views.CourseTypeViewSet)
router.register(r'assigned_courses', views.AssignedCourseViewSet)
router.register(r'enrollment_numbers', views.EnrollmentNumbersViewSet)
router.register(r'enrollment_lists', views.EnrollmentListViewSet, basename='enrollmentlist')

urlpatterns = [
  path('', include(router.urls))  
]