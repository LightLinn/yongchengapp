# 創建serializers.py文件，並將以下代碼添加到其中：
from rest_framework import serializers
from .models import Venue, VenueUsageRecord, VenueBooking, VenueBookingStatus, VenueInspectionRecord, VenueRepairRequest

# 創建VenueSerializer
class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'

# 創建VenueUsageRecordSerializer
class VenueUsageRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueUsageRecord
        fields = '__all__'

# 創建VenueBookingSerializer
class VenueBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueBooking
        fields = '__all__'

# 創建VenueBookingStatusSerializer
class VenueBookingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueBookingStatus
        fields = '__all__'

# 創建VenueInspectionRecordSerializer
class VenueInspectionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueInspectionRecord
        fields = '__all__'


# 創建VenueRepairRequestSerializer
class VenueRepairRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueRepairRequest
        fields = '__all__'  

# Path: server/venues/views.py
