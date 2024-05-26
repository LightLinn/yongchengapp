# 創建serializers.py文件，並將以下代碼添加到其中：

from rest_framework import serializers
from .models import Attendance, StaffAttendance, LifeguardAttendance

# 創建AttendanceSerializer
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class LifeguardAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LifeguardAttendance
        fields = '__all__'

# 創建StaffAttendanceSerializer
class StaffAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffAttendance
        fields = '__all__'

# Path: server/venues/views.py