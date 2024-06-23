from rest_framework import serializers
from .models import Course, CourseType, AssignedCourse, EnrollmentNumbers, EnrollmentList
from humanresources.models import Coach
from venues.models import Venue
from authentication.models import CustomUser

# 創建CourseSerializer


# 創建CourseTypeSerializer
class CourseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseType
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
    coursetype = CourseTypeSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    venue = VenueSerializer(read_only=True)
    coach = CoachSerializer(read_only=True)
    enrollment_number = EnrollmentNumbersSerializer(read_only=True)
    
    coursetype_id = serializers.PrimaryKeyRelatedField(queryset=CourseType.objects.all(), source='coursetype', write_only=True, allow_null=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), source='user', write_only=True, allow_null=True)
    venue_id = serializers.PrimaryKeyRelatedField(queryset=Venue.objects.all(), source='venue', write_only=True, allow_null=True)
    coach_id = serializers.PrimaryKeyRelatedField(queryset=Coach.objects.all(), source='coach', write_only=True, allow_null=True)
    enrollment_number_id = serializers.PrimaryKeyRelatedField(queryset=EnrollmentNumbers.objects.all(), source='enrollment_number', write_only=True, allow_null=True)
    
    class Meta:
        model = EnrollmentList
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    enrollment_list = EnrollmentListSerializer(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

# 創建AssignedCourseSerializer
class AssignedCourseSerializer(serializers.ModelSerializer):
    enrollment_details = serializers.SerializerMethodField()

    class Meta:
        model = AssignedCourse
        fields = '__all__'

    def get_enrollment_details(self, obj):
        enrollment_list = EnrollmentList.objects.filter(enrollment_number=obj.enrollment_number)
        return EnrollmentListSerializer(enrollment_list, many=True).data



