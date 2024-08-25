from django.shortcuts import render

from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from authentication.permissions import *
from rest_framework.response import Response

# 創建NotificationViewSet
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(users=user).order_by("-created_at")

    def retrieve(self, request, *args, **kwargs):
        # 獲取通知對象
        instance = self.get_object()
        
        # 檢查read_status並將其設置為True
        if not instance.read_status:
            instance.read_status = True
            instance.save()

        # 返回通知資料
        serializer = self.get_serializer(instance)
        return Response(serializer.data)






    