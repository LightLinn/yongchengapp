from django.shortcuts import render

# Create your views here.

# 創建views.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets
from .models import Venue, VenueUsageRecord, VenueBooking, VenueBookingStatus, VenueInspectionRecord, VenueRepairRequest
from .serializers import VenueSerializer, VenueRepairRequestSerializer
from authentication.permissions import *

# 創建VenueViewSet
class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all().order_by("-created_at")
    serializer_class = VenueSerializer

class VenueRepairRequestViewSet(viewsets.ModelViewSet):
    queryset = VenueRepairRequest.objects.all()
    serializer_class = VenueRepairRequestSerializer

    #當用戶為get請求時，venue欄位為對應foreign key的值
    
    

# Path: server/venues/urls.py