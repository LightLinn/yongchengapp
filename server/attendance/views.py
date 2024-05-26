from django.shortcuts import render

# Create your views here.

# 創建views.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Attendance, StaffAttendance, LifeguardAttendance
from .serializers import AttendanceSerializer, LifeguardAttendanceSerializer, StaffAttendanceSerializer
from authentication.viewset_permissions import VIEWSET_PERMISSIONS
from django.http import JsonResponse
import math

# 創建AttendanceViewSet
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        viewset_permissions = VIEWSET_PERMISSIONS.get(self.__class__.__name__, {})
        return viewset_permissions.get(self.action, [])
    
class LifeguardAttendanceViewSet(viewsets.ModelViewSet):
    queryset = LifeguardAttendance.objects.all()
    serializer_class = LifeguardAttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        viewset_permissions = VIEWSET_PERMISSIONS.get(self.__class__.__name__, {})
        return viewset_permissions.get(self.action, [])

    def create(self, request, *args, **kwargs):
        data = request.data
        lat = data.get('latitude')
        lon = data.get('longitude')
        schedule = LifeguardAttendance.objects.get(pk=data.get('schedule'))
        if is_within_50_meters(schedule, lat, lon):
            return super().create(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'You are not within 50 meters of the venue.'}, status=400)

# 創建StaffAttendanceViewSet
class StaffAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StaffAttendance.objects.all()
    serializer_class = StaffAttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        viewset_permissions = VIEWSET_PERMISSIONS.get(self.__class__.__name__, {})
        return viewset_permissions.get(self.action, [])

    # 取得前端GPS座標，並與上班場地的座標進行比較，方圓50公尺內打卡成功
    # 使用is_within_50_meters function驗證
    def create(self, request, *args, **kwargs):
        data = request.data
        lat = data.get('latitude')
        lon = data.get('longitude')
        venue = StaffAttendance.objects.get(pk=data.get('venue'))
        if is_within_50_meters(venue, lat, lon):
            return super().create(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'You are not within 50 meters of the venue.'}, status=400)


def haversine(lat1, lon1, lat2, lon2):
    r = 6371  # 地球半徑，單位為公里
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
    res = r * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))
    return res * 1000  # 轉換為公尺


def is_within_50_meters(venue, lat, lon):
    venue_lat = venue.latitude
    venue_lon = venue.longitude
    distance = haversine(venue_lat, venue_lon, lat, lon)
    return distance <= 50

'''
小數點後0位，精度約為111公里
小數點後1位，精度約為11.1公里
小數點後2位，精度約為1.11公里
小數點後3位，精度約為111米
小數點後4位，精度約為11.1米
小數點後5位，精度約為1.11米
小數點後6位，精度約為0.111米（111毫米）
小數點後7位，精度約為11.1毫米
因此，如果你想要精度到50公尺，你應該將座標值保留到小數點後3位。但是，如果你想要更高的精度，你可以將座標值保留到小數點後4位或更多。
'''