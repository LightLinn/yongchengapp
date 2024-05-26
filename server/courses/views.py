from django.shortcuts import render

# Create your views here.

# 創建Course ViewSets
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Course, CourseType
from .serializers import CourseSerializer, CourseTypeSerializer
from authentication.permissions import *

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

class CourseTypeViewSet(viewsets.ModelViewSet):
    queryset = CourseType.objects.all()
    serializer_class = CourseTypeSerializer
    permission_classes = [IsAuthenticated]

# Path: server/courses/urls.py
    