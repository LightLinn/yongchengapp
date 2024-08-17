from django.shortcuts import render

from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from authentication.permissions import *

# 創建NotificationViewSet
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer





    