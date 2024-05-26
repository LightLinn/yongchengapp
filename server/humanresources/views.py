from django.shortcuts import render

# Create your views here.

# 創建View.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets
from .models import Coach, Lifeguard, Performance, Salary, Employee
from .serializers import CoachSerializer, LifeguardSerializer, PerformanceSerializer, SalarySerializer, EmployeeSerializer
from authentication.permissions import *

class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer

class LifeguardViewSet(viewsets.ModelViewSet):
    queryset = Lifeguard.objects.all()
    serializer_class = LifeguardSerializer  

class PerformanceViewSet(viewsets.ModelViewSet):
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer

class SalaryViewSet(viewsets.ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer



    
