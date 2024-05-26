from django.urls import path, include
from . import views
from .views import UserActivityViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'useractivity', UserActivityViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
