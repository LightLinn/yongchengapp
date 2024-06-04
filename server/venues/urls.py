from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'venues', views.VenueViewSet)
router.register(r'repair', views.VenueRepairRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),  
]