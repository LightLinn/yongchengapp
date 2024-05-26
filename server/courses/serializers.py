from rest_framework import serializers
from .models import Course, CourseType

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



