# 創建urls.py 

from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import WorklogViewSet

router = DefaultRouter()
router.register(r'worklog', WorklogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
