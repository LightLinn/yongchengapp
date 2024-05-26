from django.shortcuts import render

# Create your views here.

# 創建viewset，包含查看、創建、更新、刪除工作日誌

from rest_framework import viewsets
from .models import Worklog
from .serializers import WorklogSerializer
from authentication.permissions import *

class WorklogViewSet(viewsets.ModelViewSet):
    queryset = Worklog.objects.all()
    serializer_class = WorklogSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return self.queryset.filter(employee=self.request.user.employee)
    
    def perform_create(self, serializer):
        serializer.save(employee=self.request.user.employee)
    
    def perform_update(self, serializer):
        serializer.save(employee=self.request.user.employee)
    
    def perform_destroy(self, instance):
        instance.delete()

        
