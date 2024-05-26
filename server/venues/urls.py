from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'venues', views.VenueViewSet)
router.register(r'venue-usage-records', views.VenueUsageRecordViewSet)
router.register(r'venue-bookings', views.VenueBookingViewSet)
router.register(r'venue-booking-statuses', views.VenueBookingStatusViewSet)
router.register(r'venue-inspection-records', views.VenueInspectionRecordViewSet)
router.register(r'venue-repair-requests', views.VenueRepairRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),  
]