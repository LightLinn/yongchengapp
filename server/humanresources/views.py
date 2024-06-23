from django.shortcuts import render

# Create your views here.

# 創建View.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Coach, Lifeguard, Performance, Salary, Employee
from .serializers import CoachSerializer, LifeguardSerializer, PerformanceSerializer, SalarySerializer, EmployeeSerializer
from courses.models import EnrollmentList
from schedule.models import CoahcSchedule
from datetime import datetime, timedelta

class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer

    @action(detail=False, methods=['get'], url_path='by_user')
    def get_by_user(self, request):
        user_id = request.query_params.get('userId')
        if not user_id:
            return Response({'detail': 'userId is required'}, status=400)
        try:
            coach = Coach.objects.get(user_id=user_id)
        except Coach.DoesNotExist:
            return Response({'detail': 'Coach not found'}, status=404)
        serializer = self.get_serializer(coach)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='available_coach')
    def get_available_coach(self, request):
        enrollment_id = request.query_params.get('enrollmentId')

        if not enrollment_id:
            return Response({'detail': 'enrollmentId is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            enrollment = EnrollmentList.objects.get(id=enrollment_id)
            date = enrollment.start_date
            time = enrollment.start_time
            venue = enrollment.venue
        except EnrollmentList.DoesNotExist:
            return Response({'detail': 'Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)
        except AttributeError:
            return Response({'detail': 'Enrollment data is incomplete'}, status=status.HTTP_400_BAD_REQUEST)
        
        day_of_week_mapping = {
            'Monday': '週一',
            'Tuesday': '週二',
            'Wednesday': '週三',
            'Thursday': '週四',
            'Friday': '週五',
            'Saturday': '週六',
            'Sunday': '週日'
        }
        day_of_week = day_of_week_mapping[date.strftime('%A')]
        time_slot = time.strftime('%H:%M')

        available_coaches = []

        for coach in Coach.objects.all():
            ongoing_enrollments = EnrollmentList.objects.filter(
                coach=coach,
                enrollment_status='進行中'
            )

            is_available = True

            for ongoing_enrollment in ongoing_enrollments:
                for course in ongoing_enrollment.courses.all():
                    if not course.course_time:
                        continue  # Skip courses with no time set
                    
                    course_time = datetime.combine(course.course_date, course.course_time)
                    start_time = datetime.combine(date, time)
                    end_time = start_time + timedelta(minutes=29)
                    course_venue = course.enrollment_list.venue  # Get the venue from enrollment_list
                    
                    if course_venue == venue:
                        if course_time <= end_time and course_time + timedelta(minutes=29) >= start_time:
                            is_available = False
                            break
                    else:
                        if course_time <= end_time + timedelta(minutes=30) and course_time + timedelta(minutes=59) + timedelta(minutes=30) >= start_time:
                            is_available = False
                            break
                
                if not is_available:
                    break

            # 验证教练的排班
            coach_schedule = CoahcSchedule.objects.filter(
                coach=coach,
                day_of_week=day_of_week,
                time_slot=time_slot,
                is_available=True
            ).exists()
            
            if is_available and coach_schedule:
                available_coaches.append(coach)
        
        serializer = self.get_serializer(available_coaches, many=True)
        return Response(serializer.data)

class LifeguardViewSet(viewsets.ModelViewSet):
    queryset = Lifeguard.objects.all()
    serializer_class = LifeguardSerializer

    @action(detail=False, methods=['get'], url_path='by_user')
    def get_by_user(self, request):
        user_id = request.query_params.get('userId')
        if not user_id:
            return Response({'detail': 'userId is required'}, status=400)
        try:
            lifeguard = Lifeguard.objects.get(user_id=user_id)
        except Lifeguard.DoesNotExist:
            return Response({'detail': 'Lifeguard not found'}, status=404)
        serializer = self.get_serializer(lifeguard)
        return Response(serializer.data)

class PerformanceViewSet(viewsets.ModelViewSet):
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer

class SalaryViewSet(viewsets.ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer



    
