from django.utils import timezone
from django.db.models import Q

# Create your views here.

# 創建viewset，包含查看、創建、更新、刪除工作日誌

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from .models import Worklog, SpecialCheckRecord, SpecialChecklist, PeriodicCheckRecord, PeriodicChecklist, DailyCheckRecord, DailyChecklist
from .serializers import WorklogSerializer, SpecialCheckRecordSerializer, SpecialChecklistSerializer, PeriodicCheckRecordSerializer, PeriodicChecklistSerializer, DailyCheckRecordSerializer, DailyChecklistSerializer
from authentication.permissions import *
from schedule.models import LifeguardSchedule

class WorklogViewSet(viewsets.ModelViewSet):
    queryset = Worklog.objects.all()
    serializer_class = WorklogSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 保存 Worklog 之前，提取 schedule_id
        schedule_id = serializer.validated_data.get('duty').id
        
        # 創建 Worklog 記錄
        self.perform_create(serializer)
        
        # 更新對應的 LifeguardSchedule 狀態
        try:
            schedule = LifeguardSchedule.objects.get(id=schedule_id)
            schedule.schedule_status = '已執勤'
            schedule.save()
        except LifeguardSchedule.DoesNotExist:
            return Response({"detail": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='check_worklog_status/(?P<schedule_id>[^/.]+)')
    def check_worklog_status(self, request, schedule_id=None):
        try:
            schedule = LifeguardSchedule.objects.get(id=schedule_id)
            special_check = SpecialCheckRecord.objects.filter(duty=schedule).exists()
            periodic_check = PeriodicCheckRecord.objects.filter(duty=schedule).exists()
            daily_check = DailyCheckRecord.objects.filter(duty=schedule).exists()

            return Response({
                'special_check': special_check,
                'periodic_check': periodic_check,
                'daily_check': daily_check
            })
        except LifeguardSchedule.DoesNotExist:
            return Response({'error': 'Schedule not found'}, status=404)
        
class SpecialCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = SpecialCheckRecord.objects.all()
    serializer_class = SpecialCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        venue = self.request.query_params.get('venue')
        month = self.request.query_params.get('month')
        schedule = self.request.query_params.get('schedule')

        if venue:
            queryset = queryset.filter(venue=venue)

        if month:
            queryset = queryset.filter(date__month=month)

        if schedule:
            queryset = queryset.filter(duty=schedule)

        return queryset

    @action(detail=False, methods=['get'], url_path='by_schedule')
    def by_schedule(self, request):
        schedule_id = request.query_params.get('schedule')
        if not schedule_id:
            return Response({'error': 'Schedule ID is required'}, status=400)
        
        today = timezone.now().date()
        
        records = self.get_queryset().filter(duty=schedule_id)
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        records = request.data.get('records', [])
        if not records:
            return Response({'error': 'No records provided'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=records, many=True)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'], url_path='bulk_update')
    def bulk_update(self, request):
        records = request.data.get('records', [])
        if not records:
            return Response({'error': 'No records provided'}, status=status.HTTP_400_BAD_REQUEST)

        errors = []
        updated_records = []
        for record in records:
            try:
                instance = SpecialCheckRecord.objects.get(pk=record['id'])
                serializer = self.get_serializer(instance, data=record, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    updated_records.append(serializer.data)
            except SpecialCheckRecord.DoesNotExist:
                errors.append({'id': record['id'], 'error': 'Record not found'})
            except Exception as e:
                errors.append({'id': record['id'], 'error': str(e)})

        if errors:
            return Response({'updated_records': updated_records, 'errors': errors}, status=status.HTTP_207_MULTI_STATUS)

        return Response(updated_records, status=status.HTTP_200_OK)

class SpecialChecklistViewSet(viewsets.ModelViewSet):
    queryset = SpecialChecklist.objects.all()
    serializer_class = SpecialChecklistSerializer
    # permission_classes = [permissions.IsAuthenticated]

class PeriodicCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = PeriodicCheckRecord.objects.all()
    serializer_class = PeriodicCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        venue = self.request.query_params.get('venue')
        month = self.request.query_params.get('month')
        schedule = self.request.query_params.get('schedule')

        if venue:
            queryset = queryset.filter(venue=venue)

        if month:
            queryset = queryset.filter(date__month=month)

        if schedule:
            queryset = queryset.filter(duty=schedule)

        return queryset

    @action(detail=False, methods=['get'], url_path='by_schedule')
    def by_schedule(self, request):
        schedule_id = self.request.query_params.get('schedule')
        if not schedule_id:
            return Response({'error': 'Schedule ID is required'}, status=400)
        
        records = self.get_queryset().filter(duty=schedule_id)
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        records = request.data.get('records', [])
        if not records:
            return Response({'error': 'No records provided'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=records, many=True)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'], url_path='bulk_update')
    def bulk_update(self, request):
        records = request.data.get('records', [])
        if not records:
            return Response({'error': 'No records provided'}, status=status.HTTP_400_BAD_REQUEST)

        errors = []
        updated_records = []
        for record in records:
            try:
                instance = PeriodicCheckRecord.objects.get(pk=record['id'])
                serializer = self.get_serializer(instance, data=record, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    updated_records.append(serializer.data)
            except PeriodicCheckRecord.DoesNotExist:
                errors.append({'id': record['id'], 'error': 'Record not found'})
            except Exception as e:
                errors.append({'id': record['id'], 'error': str(e)})

        if errors:
            return Response({'updated_records': updated_records, 'errors': errors}, status=status.HTTP_207_MULTI_STATUS)

        return Response(updated_records, status=status.HTTP_200_OK)

class PeriodicChecklistViewSet(viewsets.ModelViewSet):
    queryset = PeriodicChecklist.objects.all()
    serializer_class = PeriodicChecklistSerializer
    # permission_classes = [permissions.IsAuthenticated]

class DailyCheckRecordViewSet(viewsets.ModelViewSet):
    queryset = DailyCheckRecord.objects.all()
    serializer_class = DailyCheckRecordSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        venue = self.request.query_params.get('venue')
        month = self.request.query_params.get('month')

        if venue:
            queryset = queryset.filter(venue=venue)

        if month:
            queryset = queryset.filter(date__month=month)

        return queryset
    
    @action(detail=False, methods=['get'], url_path='by_schedule')
    def by_schedule(self, request):
        schedule_id = request.query_params.get('schedule')
        if not schedule_id:
            return Response({'error': 'Worklog ID is required'}, status=400)
        
        records = self.get_queryset().filter(duty=schedule_id)
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        records = request.data.get('records', [])
        if not records:
            return Response({'error': 'No records provided'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=records, many=True)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'], url_path='bulk_update')
    def bulk_update(self, request):
        records = request.data.get('records', [])
        if not records:
            return Response({'error': 'No records provided'}, status=status.HTTP_400_BAD_REQUEST)

        errors = []
        updated_records = []
        for record in records:
            try:
                instance = DailyCheckRecord.objects.get(pk=record['id'])
                serializer = self.get_serializer(instance, data=record, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    updated_records.append(serializer.data)
            except DailyCheckRecord.DoesNotExist:
                errors.append({'id': record['id'], 'error': 'Record not found'})
            except Exception as e:
                errors.append({'id': record['id'], 'error': str(e)})

        if errors:
            return Response({'updated_records': updated_records, 'errors': errors}, status=status.HTTP_207_MULTI_STATUS)

        return Response(updated_records, status=status.HTTP_200_OK)
    
    

class DailyChecklistViewSet(viewsets.ModelViewSet):
    queryset = DailyChecklist.objects.all()
    serializer_class = DailyChecklistSerializer
    # permission_classes = [permissions.IsAuthenticated]

    

        
