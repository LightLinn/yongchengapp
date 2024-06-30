from django.shortcuts import render

# Create your views here.

# 創建viewset，包含查看、創建、更新、刪除工作日誌

from rest_framework import viewsets
from .models import Worklog, SpecialCheckRecord, SpecialChecklist, PeriodicCheckRecord, PeriodicChecklist, DailyCheckRecord, DailyChecklist
from .serializers import WorklogSerializer, SpecialCheckRecordSerializer, SpecialChecklistSerializer, PeriodicCheckRecordSerializer, PeriodicChecklistSerializer, DailyCheckRecordSerializer, DailyChecklistSerializer
from authentication.permissions import *

class WorklogViewSet(viewsets.ModelViewSet):
    queryset = Worklog.objects.all()
    serializer_class = WorklogSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
class SpecialCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = SpecialCheckRecord.objects.all()
    serializer_class = SpecialCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

class SpecialChecklistViewSet(viewsets.ModelViewSet):
    queryset = SpecialChecklist.objects.all()
    serializer_class = SpecialChecklistSerializer
    # permission_classes = [permissions.IsAuthenticated]

class PeriodicCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = PeriodicCheckRecord.objects.all()
    serializer_class = PeriodicCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

class PeriodicChecklistViewSet(viewsets.ModelViewSet):
    queryset = PeriodicChecklist.objects.all()
    serializer_class = PeriodicChecklistSerializer
    # permission_classes = [permissions.IsAuthenticated]

class DailyCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = DailyCheckRecord.objects.all()
    serializer_class = DailyCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        venue = self.request.query_params.get('venue')
        month = self.request.query_params.get('month')

        if venue:
            queryset = queryset.filter(venue=venue)

        if month:
            queryset = queryset.filter(date__month=month)

        return queryset

class DailyChecklistViewSet(viewsets.ModelViewSet):
    queryset = DailyChecklist.objects.all()
    serializer_class = DailyChecklistSerializer
    # permission_classes = [permissions.IsAuthenticated]

    

        
