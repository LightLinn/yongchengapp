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
from .serializers import CourseSerializer, CourseTypeSerializer, AssignedCourseSerializer, EnrollmentNumbersSerializer, EnrollmentListSerializer
from authentication.permissions import *

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    # 以EnrollmentList id and EnrollmentNumber，查詢符合的結果，回傳前端
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
    

class EnrollmentNumbersViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentNumbers.objects.all()
    serializer_class = EnrollmentNumbersSerializer
    

class EnrollmentListViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentList.objects.all()
    serializer_class = EnrollmentListSerializer
    # permission_classes = [IsAuthenticated]

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
        remark = request.data.get('remark', None)

        if enrollment_status:
            enrollment.enrollment_status = enrollment_status
        if payment_amount is not None:
            enrollment.payment_amount = payment_amount
        if payment_method:
            enrollment.payment_method = payment_method
        if remark:
            enrollment.remark = remark

        enrollment.save()
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    