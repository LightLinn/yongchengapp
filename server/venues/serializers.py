# 創建serializers.py文件，並將以下代碼添加到其中：
from rest_framework import serializers
from .models import Venue, VenueRepairRequest
from authentication.serializers import UserSerializer
from authentication.models import CustomUser

# 創建VenueSerializer
class VenueSerializer(serializers.ModelSerializer):
    managers = UserSerializer(many=True, read_only=True)
    managers_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        write_only=True,
        source='managers',
        many=True
    )

    class Meta:
        model = Venue
        fields = '__all__'

    def create(self, validated_data):
        managers_data = validated_data.pop('managers')
        venue = Venue.objects.create(**validated_data)
        venue.managers.set(managers_data)
        return venue

    def update(self, instance, validated_data):
        managers_data = validated_data.pop('managers')
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.capacity = validated_data.get('capacity', instance.capacity)
        instance.weekday_open_time = validated_data.get('weekday_open_time', instance.weekday_open_time)
        instance.weekday_close_time = validated_data.get('weekday_close_time', instance.weekday_close_time)
        instance.holiday_open_time = validated_data.get('holiday_open_time', instance.holiday_open_time)
        instance.holiday_close_time = validated_data.get('holiday_close_time', instance.holiday_close_time)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.address = validated_data.get('address', instance.address)
        instance.save()

        if managers_data:
            instance.managers.set(managers_data)

        return instance

class VenuePartialSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Venue
        fields = ['id', 'name']  # 获取部分的信息

class VenueRepairRequestSerializer(serializers.ModelSerializer):
    # venue = VenuePartialSerializer()
    # venue_details = VenueSerializer(source='venue', read_only=True)  # 添加完整信息的字段

    class Meta:
        model = VenueRepairRequest
        fields = ['id', 'title', 'description', 'repair_status', 'venue', 'created_at', 'updated_at', 'user']

