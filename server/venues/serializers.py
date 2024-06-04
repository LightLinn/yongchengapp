# 創建serializers.py文件，並將以下代碼添加到其中：
from rest_framework import serializers
from .models import Venue, VenueRepairRequest
from authentication.serializers import UserSerializer
from authentication.models import CustomUser

# 創建VenueSerializer
class VenueSerializer(serializers.ModelSerializer):
    managers = UserSerializer(many=True)

    class Meta:
        model = Venue
        fields = '__all__'

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

