from django.shortcuts import render

# Create your views here.

# 創建View.py文件，並將以下代碼添加到其中：
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Coach, Lifeguard, Performance, Salary, Employee
from .serializers import CoachSerializer, LifeguardSerializer, PerformanceSerializer, SalarySerializer, EmployeeSerializer
from authentication.permissions import *

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



    
