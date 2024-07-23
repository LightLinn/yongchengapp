# 創建serializers.py文件

from rest_framework import serializers
from .models import LifeguardSchedule, CoahcSchedule, Location, UnavailableSlot
from venues.models import Venue
from humanresources.models import Coach
from authentication.serializers import UserSerializer

class UnavailableSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailableSlot
        fields = '__all__'

class LifeguardScheduleSerializer(serializers.ModelSerializer):
    venue_name = serializers.SerializerMethodField('get_venue_name')
    lifeguard_name = serializers.SerializerMethodField('get_lifeguard_name')
    lifeguard_nickname = serializers.SerializerMethodField('get_lifeguaer_nickname')

    class Meta:
        model = LifeguardSchedule
        fields = '__all__'

    # 取得venue的名稱
    def get_venue_name(self, obj):
        return obj.venue.name if obj.venue else None
    
    #取得救生員的名稱
    def get_lifeguard_name(self, obj):
        return obj.lifeguard.user.username
    
    def get_lifeguaer_nickname(self, obj):
        return obj.lifeguard.user.nickname

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

        
