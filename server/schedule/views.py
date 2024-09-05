from django.shortcuts import render
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import LifeguardSchedule, CoahcSchedule, Location, UnavailableSlot
from .serializers import LifeguardScheduleSerializer, CoachScheduleSerializer, LocationSerializer, UnavailableSlotSerializer
from authentication.permissions import *
from datetime import date, datetime, timedelta
from django.contrib.auth.models import Group
from authentication.models import CustomUser
from notifications.models import Notification
from notifications.utils import create_system_notification

class UnavailableSlotViewSet(viewsets.ModelViewSet):
    queryset = UnavailableSlot.objects.all()
    serializer_class = UnavailableSlotSerializer

    def get_queryset(self):
        lifeguard_id = self.request.query_params.get('lifeguard_id')
        month = self.request.query_params.get('month')
        queryset = self.queryset
        
        if lifeguard_id:
            queryset = queryset.filter(lifeguard_id=lifeguard_id)

        if month:
            try:
                year, month = map(int, month.split('-'))
                first_day = datetime(year, month, 1)
                last_day = (first_day + timedelta(days=32)).replace(day=1) - timedelta(days=1)
                queryset = queryset.filter(date__range=(first_day, last_day))
            except ValueError:
                pass

        return queryset.order_by('date')  

    def create(self, request, *args, **kwargs):
        today = timezone.now().date()
        next_month = today.replace(day=1) + timedelta(days=32)
        next_month = next_month.replace(day=1)
        if today.day > 25:
            return Response({'detail': '次月班表規劃中'}, status=400)

        dates = request.data.get('dates')
        lifeguard_id = request.data.get('lifeguard_id')
        # if not dates or len(dates) != 4:
        #     return Response({'detail': '請選擇四天日期'}, status=400)

        # 刪除當前救生員在次月的排休日期
        UnavailableSlot.objects.filter(
            lifeguard_id=lifeguard_id,
            date__year=next_month.year,
            date__month=next_month.month
        ).delete()

        for date in dates:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
            if date_obj.month != next_month.month or date_obj.year != next_month.year:
                return Response({'detail': '日期必須在次月範圍內'}, status=400)

            UnavailableSlot.objects.update_or_create(
                lifeguard_id=lifeguard_id,
                date=date_obj,
                defaults={
                    'start_time': '07:00',
                    'end_time': '22:00',
                    'allow': True  # 或者設置為 False，根據需求設置默認值
                }
            )

        return Response({'detail': '排休日期已保存'}, status=201)

class LifeguardScheduleViewSet(viewsets.ModelViewSet):
    queryset = LifeguardSchedule.objects.all()
    serializer_class = LifeguardScheduleSerializer
    
    def get_queryset(self):
        lifeguard_id = self.request.query_params.get('lifeguard_id')
        
        if lifeguard_id is None:
            return self.queryset
        
        try:
            lifeguard_id = int(lifeguard_id)
        except ValueError:
            return self.queryset.none()

        today = timezone.now().date()
        return self.queryset.filter(lifeguard_id=lifeguard_id, date=today)
    
    @action(detail=False, methods=['get'], url_path='by_lifeguardid')
    def get_schedules_by_lifeguardid(self, request):
        lifeguard_id = self.request.query_params.get('lifeguard_id')
        all_param = self.request.query_params.get('all', '0')
        
        if lifeguard_id is None:
            return Response({'detail': 'lifeguard_id is required'}, status=400)
        
        try:
            lifeguard_id = int(lifeguard_id)
        except ValueError:
            return Response({'detail': 'Invalid lifeguard_id format'}, status=400)
        
        schedules = self.queryset.filter(lifeguard_id=lifeguard_id)

        if all_param != '1':
            today = timezone.now().date()
            schedules = schedules.filter(date__lte=today)

        schedules = schedules.order_by('-date')
        
        serializer = self.get_serializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by_venueid')
    def get_schedules_by_venueid(self, request):
        venue_id = self.request.query_params.get('venue_id')
        
        if venue_id is None:
            return Response({'detail': 'venue_id is required'}, status=400)
        
        try:
            venue_id = int(venue_id)
        except ValueError:
            return Response({'detail': 'Invalid venue_id format'}, status=400)

        schedules = self.queryset.filter(venue_id=venue_id)
        serializer = self.get_serializer(schedules, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        schedules = request.data.get('schedules', [])
        if not schedules:
            return Response({'detail': 'No schedules provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        created_schedules = []
        for schedule_data in schedules:
            serializer = self.get_serializer(data=schedule_data)
            if serializer.is_valid():
                self.perform_create(serializer)
                created_schedules.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(created_schedules, status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer):
        instance = serializer.save()
        lifeguard = instance.lifeguard.user

        group = Group.objects.get(name='內部_救生員')

        create_system_notification(
            user=lifeguard,
            title=f'新班表通知',
            content=f'已新增 {instance.venue.name} {instance.date} {instance.start_time} - {instance.end_time} 時段的班表。',
            type='排班公告',
        )

    @action(detail=True, methods=['put'], url_path='sign_out')
    def sign_out(self, request, pk=None):
        schedule = self.get_object()
        if schedule.schedule_status != '執勤中':
            return Response({'detail': '無法簽退，當前狀態不是執勤中'}, status=status.HTTP_400_BAD_REQUEST)

        schedule.schedule_status = '已執勤'
        schedule.save()
        serializer = self.get_serializer(schedule)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class CoachScheduleViewSet(viewsets.ModelViewSet):
    queryset = CoahcSchedule.objects.all()
    serializer_class = CoachScheduleSerializer

    def get_queryset(self):
        coach_id = self.request.query_params.get('coach_id')
        location_id = self.request.query_params.get('location_id')
        queryset = self.queryset
        if coach_id and location_id:
            queryset = queryset.filter(coach_id=coach_id, location_id=location_id)
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        schedule, created = CoahcSchedule.objects.update_or_create(
            coach_id=data['coach'],
            location_id=data['location'],
            day_of_week=data['day_of_week'],
            time_slot=data['time_slot'],
            defaults={'is_available': data['is_available']}
        )
        if created:
            return Response({'status': 'created'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'updated'}, status=status.HTTP_200_OK)


    