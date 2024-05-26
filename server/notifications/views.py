from django.shortcuts import render

from rest_framework import viewsets
from .models import Notification, NotificationType
from .serializers import NotificationSerializer, NotificationTypeSerializer
from authentication.permissions import *

# 創建NotificationViewSet
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

# 創建NotificationTypeViewSet
class NotificationTypeViewSet(viewsets.ModelViewSet):
    queryset = NotificationType.objects.all()
    serializer_class = NotificationTypeSerializer



    