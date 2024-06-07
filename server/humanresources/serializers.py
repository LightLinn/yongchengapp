# 創建serializers.py文件，並將以下代碼添加到其中：

from rest_framework import serializers
from .models import Coach, Lifeguard, Performance, Salary, SalaryRange, Employee
from authentication.serializers import UserSerializer

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class CoachSerializer(serializers.ModelSerializer):
    # 增加教練的Nickname
    user = UserSerializer()

    class Meta:
        model = Coach
        fields = '__all__'

class LifeguardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lifeguard
        fields = '__all__'

class PerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performance
        fields = '__all__'

class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = '__all__'

class SalaryRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryRange
        fields = '__all__'