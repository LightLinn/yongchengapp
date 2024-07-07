# 創建serializers.py文件，並將以下代碼添加到其中：

from rest_framework import serializers
from .models import Attendance, StaffAttendance, LifeguardAttendance
from authentication.models import CustomUser
from courses.models import Course, EnrollmentList, CourseType
from venues.models import Venue
from humanresources.models import Coach

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'nickname']


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['id', 'name']

class CoachSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Coach
        fields = ['id', 'user']

class CourseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseType
        fields = ['id', 'name']

class EnrollmentListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    venue = VenueSerializer(read_only=True)
    coach = CoachSerializer(read_only=True)
    coursetype = CourseTypeSerializer(read_only=True)

    class Meta:
        model = EnrollmentList
        fields = ['id', 'student', 'user', 'enrollment_status', 'venue', 'coach', 'coursetype']

class CourseSerializer(serializers.ModelSerializer):
    enrollment_list = EnrollmentListSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ['id',  'enrollment_list']

class AttendanceListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), source='user', write_only=True)
    course_id = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), source='course', write_only=True)

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