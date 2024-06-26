from django.shortcuts import render

# Create your views here.

# 創建views.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Attendance, StaffAttendance, LifeguardAttendance
from schedule.models import LifeguardSchedule
from .serializers import AttendanceListSerializer, LifeguardAttendanceSerializer, StaffAttendanceSerializer
from authentication.viewset_permissions import VIEWSET_PERMISSIONS
from django.http import JsonResponse
import math
import random
from datetime import date

# 創建AttendanceViewSet
class AttendanceListViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset
    
    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

    @action(detail=False, methods=['get'])
    def get_checkcode(self, request):
        user_id = request.query_params.get('user')
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)
        
        return self.create_check_code(user_id)

    def create_check_code(self, user_id):
        # 生成一個四位數的隨機碼
        random_code = random.randint(1000, 9999)
        # 獲取當天日期
        today = date.today().isoformat()

        # 生成驗證碼
        verification_code = f"{user_id},{today},{random_code}"

        return JsonResponse({"checkcode": verification_code})
    
class LifeguardAttendanceViewSet(viewsets.ModelViewSet):
    queryset = LifeguardAttendance.objects.all()
    serializer_class = LifeguardAttendanceSerializer

    def haversine(lat1, lon1, lat2, lon2):
        r = 6371  # 地球半徑，單位為公里
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
        res = r * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))
        return res * 1000  # 轉換為公尺

    def is_within_50_meters(venue, lat, lon):
        venue_lat = venue.latitude
        venue_lon = venue.longitude
        distance = LifeguardAttendanceViewSet.haversine(venue_lat, venue_lon, lat, lon)
        return distance <= 50

    def create(self, request, *args, **kwargs):
        user = request.data.get('user')
        schedule_id = request.data.get('schedule')
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
        
        try:
            schedule = LifeguardSchedule.objects.get(id=schedule_id)
            venue = schedule.venue
            
            if not LifeguardAttendanceViewSet.is_within_50_meters(venue, latitude, longitude):
                
                # return Response({'detail': '你不在場地範圍內'}, status=status.HTTP_400_BAD_REQUEST)
                return JsonResponse({'error': 'You are not within 50 meters of the venue.'}, status=400)
            
        except LifeguardSchedule.DoesNotExist:
            return Response({'detail': '無效的班表ID'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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