from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'reviews', views.ReviewViewSet)
router.register(r'review-stages', views.ReviewStageViewSet)

urlpatterns = [
  path('', include(router.urls)),
]