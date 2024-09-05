from django.shortcuts import render

# Create your views here.

# 創建views.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets
from .models import Venue, VenueRepairRequest, VenueManagerList
from .serializers import VenueSerializer, VenueRepairRequestSerializer, VenueManagerListSerializer
from authentication.permissions import *
from django.contrib.auth.models import Group
from authentication.models import CustomUser
from notifications.models import Notification
from notifications.utils import create_system_notification

# 創建VenueViewSet
class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all().order_by("-created_at")
    serializer_class = VenueSerializer

class VenueRepairRequestViewSet(viewsets.ModelViewSet):
    queryset = VenueRepairRequest.objects.all()
    serializer_class = VenueRepairRequestSerializer

    #當用戶為create，創建一筆Notification，通知指定群組所有人員
    def perform_create(self, serializer):
        instance = serializer.save()
        group = Group.objects.get(name='內部_管理人員')
        ycappsystem = CustomUser.objects.get(username='ycappsystem')
        users = group.user_set.all()
        print(users)

        for user in users:
            print(user)
            create_system_notification(
                user=user,
                title=f'{instance.venue.name}報修申請通知',
                content=f'{instance.venue.name}有新的報修申請，請盡快處理',
                type='全體公告',
            )
    
    #當用戶為update，創建一筆Notification，通知指定群組所有人員
    def perform_update(self, serializer):
        instance = serializer.save()
        group = Group.objects.get(name='內部_管理人員')
        ycappsystem = CustomUser.objects.get(username='ycappsystem')
        users = group.user_set.all()

        for user in users:
            create_system_notification(
                user=user,
                title=f'{instance.venue.name}報修更新通知',
                content=f'{instance.venue.name}的報修申請已更新，請盡快處理',
                type='全體公告',
            )


class VenueManagerListViewSet(viewsets.ModelViewSet):
    queryset = VenueManagerList.objects.all()
    serializer_class = VenueManagerListSerializer
    

# Path: server/venues/urls.py