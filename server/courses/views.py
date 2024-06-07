from django.shortcuts import render

# Create your views here.

# 創建Course ViewSets
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Course, CourseType, AssignedCourse, EnrollmentNumbers, EnrollmentList
from .serializers import CourseSerializer, CourseTypeSerializer, AssignedCourseSerializer, EnrollmentNumbersSerializer, EnrollmentListSerializer, EnrollmentListCreateSerializer
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
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset

class EnrollmentListCreateViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentList.objects.all()
    serializer_class = EnrollmentListCreateSerializer
    # permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
# Path: server/courses/urls.py
    