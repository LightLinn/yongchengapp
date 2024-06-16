# 創建serializers.py文件

from rest_framework import serializers
from .models import LifeguardSchedule, CoahcSchedule, Location, UnavailableSlot
from humanresources.models import Coach
from authentication.serializers import UserSerializer

class UnavailableSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailableSlot
        fields = '__all__'

class LifeguardScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LifeguardSchedule
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name']

class CoachSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Coach
        fields = '__all__'

class CoachScheduleSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    coach = CoachSerializer(read_only=True)

    location_id = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all(), source='location', write_only=True)
    coach_id = serializers.PrimaryKeyRelatedField(queryset=Coach.objects.all(), source='coach', write_only=True)

    class Meta:
        model = CoahcSchedule
        fields = '__all__'

        
