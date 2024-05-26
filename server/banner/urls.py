# 創建urls.py文件，並編寫以下代碼

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'banner', views.BannerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]