from django.shortcuts import render

# Create your views here.

# 創建views.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets
from .models import Venue, VenueRepairRequest, VenueManagerList
from .serializers import VenueSerializer, VenueRepairRequestSerializer, VenueManagerListSerializer
from authentication.permissions import *

# 創建VenueViewSet
class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all().order_by("-created_at")
    serializer_class = VenueSerializer

class VenueRepairRequestViewSet(viewsets.ModelViewSet):
    queryset = VenueRepairRequest.objects.all()
    serializer_class = VenueRepairRequestSerializer

    #當用戶為get請求時，venue欄位為對應foreign key的值

class VenueManagerListViewSet(viewsets.ModelViewSet):
    queryset = VenueManagerList.objects.all()
    serializer_class = VenueManagerListSerializer
    

# Path: server/venues/urls.py