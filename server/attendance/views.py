from django.shortcuts import render

# Create your views here.

# 創建views.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Attendance, StaffAttendance, LifeguardAttendance
from humanresources.models import Lifeguard
from courses.models import Course
from schedule.models import LifeguardSchedule
from .serializers import AttendanceListSerializer, LifeguardAttendanceSerializer, StaffAttendanceSerializer
from authentication.viewset_permissions import VIEWSET_PERMISSIONS
import math
from datetime import datetime, date, timedelta


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
        check_code = serializer.validated_data.get('check_code')
        course_id = serializer.validated_data.get('course').id
        try:
            lifeguard_id_str, schedule_date_str, venue_id_str, schedule_id_str = check_code.split(',')
            lifeguard_id = int(lifeguard_id_str.strip())
            venue_id = int(venue_id_str.strip())
            schedule_id = int(schedule_id_str.strip())
            schedule_date = datetime.strptime(schedule_date_str.strip(), '%Y-%m-%d').date()
            
            schedule = LifeguardSchedule.objects.filter(
                id=schedule_id,
                lifeguard_id=lifeguard_id,
                date=schedule_date,
            ).first()
            
            if schedule:
                course = Course.objects.filter(
                    id=course_id,
                    enrollment_list__venue_id=venue_id
                ).first()

                if course:
                    course.course_status = '已完成'
                    course.save()
                    
                    serializer.save(user=user)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response({'detail': '簽到失敗，驗證結果有誤，課程地點不匹配'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'detail': '簽到失敗，驗證結果有誤，無效的班表'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({'detail': f'簽到失敗，無效的驗證碼格式: {e}'}, status=status.HTTP_400_BAD_REQUEST)
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = self.perform_create(serializer)
        if response:
            return response
        else:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def get_checkcode(self, request):
        user_id = request.query_params.get('user')
        if not user_id:
            return Response({'detail': 'User ID is required'}, status=400)

        try:
            lifeguard = Lifeguard.objects.get(user=user_id)
        except Lifeguard.DoesNotExist:
            return Response({'detail': 'Lifeguard not found'}, status=404)

        lifeguard_id = lifeguard.id

        today = date.today()
        current_time = datetime.now().time()
        start_range = (datetime.combine(today, current_time) - timedelta(hours=2)).time()
        end_range = (datetime.combine(today, current_time) + timedelta(hours=1)).time()
        
        schedules = LifeguardSchedule.objects.filter(lifeguard=lifeguard_id, date=today)
        
        if not schedules.exists():
            return Response({'detail': '今日無班表'}, status=404)

        valid_schedule = None
        for schedule in schedules:
            if schedule.start_time <= end_range and schedule.end_time >= start_range:
                valid_schedule = schedule
                break

        if not valid_schedule:
            return Response({'detail': '當前時間未找到有效的時間表'}, status=404)

        return self.create_check_code(lifeguard_id, valid_schedule)

    def create_check_code(self, lifeguard_id, schedule):
        # 生成包含救生員ID、班表日期、場地ID和班表ID的驗證碼
        verification_code = f"{lifeguard_id},{schedule.date},{schedule.venue_id},{schedule.id}"
        return Response({"detail": verification_code})

    
class LifeguardAttendanceViewSet(viewsets.ModelViewSet):
    queryset = LifeguardAttendance.objects.all()
    serializer_class = LifeguardAttendanceSerializer

    @staticmethod
    def haversine(lat1, lon1, lat2, lon2):
        r = 6371  # 地球半徑，單位為公里
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
        res = r * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))
        return res * 1000  # 轉換為公尺

    @staticmethod
    def is_within_50_meters(venue, lat, lon):
        venue_lat = venue.latitude
        venue_lon = venue.longitude
        distance = LifeguardAttendanceViewSet.haversine(venue_lat, venue_lon, lat, lon)
        return distance <= 50

    def create(self, request, *args, **kwargs):
        user = request.user
        schedule_id = request.data.get('schedule')
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
        
        try:
            schedule = LifeguardSchedule.objects.get(id=schedule_id)
            venue = schedule.venue
            
            if not self.is_within_50_meters(venue, latitude, longitude):
                return Response({'detail': '你不在場地範圍內'}, status=status.HTTP_400_BAD_REQUEST)
            
            now = datetime.now()
            start_time = datetime.combine(schedule.date, schedule.start_time)
            earliest_sign_in_time = start_time - timedelta(minutes=30)
            latest_sign_in_time = start_time + timedelta(minutes=5)
            
            if now <= earliest_sign_in_time:
                return Response({'detail': '簽到時間過早，請於班前30分鐘內簽到'}, status=status.HTTP_400_BAD_REQUEST)
            if now >= latest_sign_in_time:
                return Response({'detail': '已超過簽到時間，無法簽到'}, status=status.HTTP_400_BAD_REQUEST)
            
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
            return Response({'error': 'You are not within 50 meters of the venue.'}, status=401)


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