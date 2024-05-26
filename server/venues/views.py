from django.shortcuts import render

# Create your views here.

# 創建views.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets
from .models import Venue, VenueUsageRecord, VenueBooking, VenueBookingStatus, VenueInspectionRecord, VenueRepairRequest
from .serializers import VenueSerializer, VenueUsageRecordSerializer, VenueBookingSerializer, VenueBookingStatusSerializer, VenueInspectionRecordSerializer, VenueRepairRequestSerializer
from authentication.permissions import *

# 創建VenueViewSet
class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

# 創建VenueUsageRecordViewSet
class VenueUsageRecordViewSet(viewsets.ModelViewSet):
    queryset = VenueUsageRecord.objects.all()
    serializer_class = VenueUsageRecordSerializer

# 創建VenueBookingViewSet
class VenueBookingViewSet(viewsets.ModelViewSet):
    queryset = VenueBooking.objects.all()
    serializer_class = VenueBookingSerializer

# 創建VenueBookingStatusViewSet
class VenueBookingStatusViewSet(viewsets.ModelViewSet):
    queryset = VenueBookingStatus.objects.all()
    serializer_class = VenueBookingStatusSerializer

# 創建VenueInspectionRecordViewSet
class VenueInspectionRecordViewSet(viewsets.ModelViewSet):
    queryset = VenueInspectionRecord.objects.all()
    serializer_class = VenueInspectionRecordSerializer

# 創建VenueRepairRequestViewSet
class VenueRepairRequestViewSet(viewsets.ModelViewSet):
    queryset = VenueRepairRequest.objects.all()
    serializer_class = VenueRepairRequestSerializer
    

# Path: server/venues/urls.py