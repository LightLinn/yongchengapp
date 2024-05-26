from django.shortcuts import render

# Create your views here.

# 創建viewsets  

from rest_framework import viewsets
from .models import LifeguardSchedule
from .serializers import LifeguardScheduleSerializer
from authentication.permissions import *

class LifeguardScheduleViewSet(viewsets.ModelViewSet):
    queryset = LifeguardSchedule.objects.all()
    serializer_class = LifeguardScheduleSerializer
    # permission_classes = [permissions.IsAuthenticated]

    