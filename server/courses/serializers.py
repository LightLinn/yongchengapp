from rest_framework import serializers
from .models import Course, CourseType, AssignedCourse, EnrollmentNumbers, EnrollmentList
from humanresources.models import Coach
from venues.models import Venue
from authentication.models import CustomUser

# 創建CourseSerializer
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

# 創建CourseTypeSerializer
class CourseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseType
        fields = '__all__'

# 創建AssignedCourseSerializer
class AssignedCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedCourse
        fields = '__all__'

# 創建EnrollmentNumbersSerializer
class EnrollmentNumbersSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrollmentNumbers
        fields = ['id', 'status', 'name']

class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = CustomUser
            fields = ['id', 'username', 'nickname']

class CoachSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Coach
        fields = ['id', 'user']

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['id', 'name']

# 創建EnrollmentListSerializer
class EnrollmentListSerializer(serializers.ModelSerializer):
    coursetype = CourseTypeSerializer()
    user = UserSerializer()
    venue = VenueSerializer()
    coach = CoachSerializer()
    enrollment_number = EnrollmentNumbersSerializer()

    class Meta:
        model = EnrollmentList
        fields = '__all__'

class EnrollmentListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrollmentList
        fields = '__all__'
        



