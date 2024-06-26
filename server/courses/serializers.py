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
    enrollment_count = serializers.SerializerMethodField()
    same_course_type = serializers.SerializerMethodField()
    course_type_limit_reached = serializers.SerializerMethodField()

    class Meta:
        model = EnrollmentNumbers
        fields = ['id', 'status', 'name', 'enrollment_count', 'same_course_type', 'course_type_limit_reached']

    def get_enrollment_count(self, obj):
        return EnrollmentList.objects.filter(enrollment_number=obj).count()
    
    def get_same_course_type(self, obj):
        enrollments = EnrollmentList.objects.filter(enrollment_number=obj)
        if enrollments.exists():
            first_course_type = enrollments.first().coursetype
            return all(enrollment.coursetype == first_course_type for enrollment in enrollments)
        return False

    def get_course_type_limit_reached(self, obj):
        enrollments = EnrollmentList.objects.filter(enrollment_number=obj)
        if enrollments.exists():
            first_course_type = enrollments.first().coursetype
            if all(enrollment.coursetype == first_course_type for enrollment in enrollments):
                enrollment_count = enrollments.count()
                return enrollment_count == first_course_type.limit
        return False

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
    course_inprogress = serializers.SerializerMethodField()
    course_completed = serializers.SerializerMethodField()
    course_total = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    # 計算狀態總數量
    def get_course_total(self, obj):
        return obj.enrollment_list.coursetype.number_of_sessions

    # 計算狀態為「進行中」的數量
    def get_course_inprogress(self, obj):
        return Course.objects.filter(enrollment_number=obj.enrollment_number, course_status='進行中').count()

    # 計算狀態為「已完成」的數量
    def get_course_completed(self, obj):
        return Course.objects.filter(enrollment_number=obj.enrollment_number, course_status='已完成').count()

# 創建AssignedCourseSerializer
class AssignedCourseSerializer(serializers.ModelSerializer):
    enrollment_details = serializers.SerializerMethodField()
    coach_name = serializers.SerializerMethodField()

    class Meta:
        model = AssignedCourse
        fields = '__all__'

    def get_enrollment_details(self, obj):
        enrollment_list = EnrollmentList.objects.filter(enrollment_number=obj.enrollment_number)
        return EnrollmentListSerializer(enrollment_list, many=True).data
    
    def get_coach_name(self, obj):
        return obj.coach.user.nickname
