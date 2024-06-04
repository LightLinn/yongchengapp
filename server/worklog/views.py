from django.shortcuts import render

# Create your views here.

# 創建viewset，包含查看、創建、更新、刪除工作日誌

from rest_framework import viewsets
from .models import Worklog, SpecialCheckRecord, PeriodicCheckRecord, DailyCheckRecord
from .serializers import WorklogSerializer, SpecialCheckRecordSerializer, PeriodicCheckRecordSerializer, DailyCheckRecordSerializer
from authentication.permissions import *

class WorklogViewSet(viewsets.ModelViewSet):
    queryset = Worklog.objects.all()
    serializer_class = WorklogSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
class SpecialCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = SpecialCheckRecord.objects.all()
    serializer_class = SpecialCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

class PeriodicCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = PeriodicCheckRecord.objects.all()
    serializer_class = PeriodicCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

class DailyCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = DailyCheckRecord.objects.all()
    serializer_class = DailyCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

    

        
