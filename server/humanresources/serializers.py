# 創建serializers.py文件，並將以下代碼添加到其中：

from rest_framework import serializers
from .models import Coach, Lifeguard, Performance, Salary, SalaryRange, Employee
from authentication.serializers import UserSerializer
from courses.models import EnrollmentList

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Employee
        fields = '__all__'

class CoachSerializer(serializers.ModelSerializer):
    # 增加教練的Nickname
    user = UserSerializer()
    ongoing_enrollments_count = serializers.SerializerMethodField()
    ongoing_courses_count = serializers.SerializerMethodField()

    class Meta:
        model = Coach
        fields = '__all__'

    def get_ongoing_enrollments_count(self, obj):
        return EnrollmentList.objects.filter(coach=obj, enrollment_status='進行中').count()

    def get_ongoing_courses_count(self, obj):
        return EnrollmentList.objects.filter(coach=obj, courses__course_status='進行中').distinct().count()

class LifeguardSerializer(serializers.ModelSerializer):
    user = UserSerializer()

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