from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'notifications', views.NotificationViewSet)

urlpatterns = [
  path('', include(router.urls)),  
]