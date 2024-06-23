from django.shortcuts import render
from rest_framework.serializers import ValidationError

# Create your views here.

# 創建Course ViewSets
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Course, CourseType, AssignedCourse, EnrollmentNumbers, EnrollmentList
from humanresources.models import Coach
from .serializers import CourseSerializer, CourseTypeSerializer, AssignedCourseSerializer, EnrollmentNumbersSerializer, EnrollmentListSerializer
from authentication.permissions import *
from datetime import datetime, timedelta

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        queryset = Course.objects.all()
        enrollment_list_id = self.request.query_params.get('enrollment_list_id', None)
        enrollment_number = self.request.query_params.get('enrollment_number', None)
        if enrollment_list_id is not None:
            queryset = queryset.filter(enrollment_list__id=enrollment_list_id)
        if enrollment_number is not None:
            queryset = queryset.filter(enrollment_list__enrollment_number__name=enrollment_number)
        return queryset
    
    

class CourseTypeViewSet(viewsets.ModelViewSet):
    queryset = CourseType.objects.all()
    serializer_class = CourseTypeSerializer


class AssignedCourseViewSet(viewsets.ModelViewSet):
    queryset = AssignedCourse.objects.all()
    serializer_class = AssignedCourseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        coach_id = self.request.query_params.get('coach', None)
        if coach_id is not None:
            try:
                coach = Coach.objects.get(user_id=coach_id)
                queryset = queryset.filter(coach=coach)
                # 篩選當前時間在assigned_time and deadline之間的資料
                queryset = queryset.filter(assigned_time__lte=datetime.now(), deadline__gte=datetime.now())
            except Coach.DoesNotExist:
                return queryset.none()
        return queryset

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        assignment = self.get_object()
        status = request.data.get('status')
        if status not in ['已接受', '已拒絕']:
            return Response({'detail': 'Invalid status'}, status=400)
        assignment.assigned_status = status
        assignment.save()
        return Response(self.get_serializer(assignment).data)

    @action(detail=False, methods=['post'], url_path='create_assigned_course')
    def create_assigned_course(self, request):
        try:
            assigned_courses_data = request.data if isinstance(request.data, list) else [request.data]

            for course_data in assigned_courses_data:
                rank = course_data.get('rank')
                decide_hours = course_data.get('considerHours')
                coach_username = course_data.get('coach')
                enrollment_number_id = course_data.get('enrollment_number')
                assigned_status = course_data.get('assigned_status')
                assigned_time = course_data.get('assigned_time')
                deadline = course_data.get('deadline')

                try:
                    coach = Coach.objects.get(user__username=coach_username)
                except Coach.DoesNotExist:
                    return Response({'detail': 'Coach not found'}, status=status.HTTP_404_NOT_FOUND)

                enrollment_number = EnrollmentNumbers.objects.get(id=enrollment_number_id)

                new_assigned_course = AssignedCourse(
                    rank=rank,
                    decide_hours=decide_hours,
                    coach=coach,
                    enrollment_number=enrollment_number,
                    assigned_status=assigned_status,
                    assigned_time=datetime.fromisoformat(assigned_time.replace('Z', '+00:00')),
                    deadline=datetime.fromisoformat(deadline.replace('Z', '+00:00')),
                )
                new_assigned_course.save()

            return Response({'detail': 'Assigned courses created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class EnrollmentNumbersViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentNumbers.objects.all()
    serializer_class = EnrollmentNumbersSerializer
    

class EnrollmentListViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentList.objects.all()
    serializer_class = EnrollmentListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user', None)
        coach_id = self.request.query_params.get('coach', None)
        if user_id is not None:
            return queryset.filter(user_id=user_id)
        if coach_id is not None:
            return queryset.filter(coach__user__id=coach_id)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='latest')
    def latest_enrollment(self, request):
        user_id = request.query_params.get('user', None)
        if not user_id:
            return Response({"detail": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            latest_enrollment = EnrollmentList.objects.filter(user_id=user_id).latest('created_at')
            serializer = EnrollmentListSerializer(latest_enrollment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EnrollmentList.DoesNotExist:
            return Response({"detail": "No enrollment records found for this user."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        enrollment = self.get_object()
        enrollment_status = request.data.get('enrollment_status', None)
        payment_amount = request.data.get('payment_amount', None)
        payment_method = request.data.get('payment_method', None)
        payment_date = request.data.get('payment_date', None)
        remark = request.data.get('remark', None)
        coach = request.data.get('coach', None)

        if enrollment_status:
            enrollment.enrollment_status = enrollment_status
        if payment_amount is not None:
            enrollment.payment_amount = payment_amount
        if payment_method:
            enrollment.payment_method = payment_method
        if payment_date:  
            enrollment.payment_date = payment_date
        if coach:
            coach = Coach.objects.get(user__username=coach)
            enrollment.coach = coach
        if remark:
            enrollment.remark = remark

        enrollment.save()
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'])
    def update_enrollment(self, request, pk=None):
        enrollment = self.get_object()
        serializer = EnrollmentListSerializer(enrollment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    