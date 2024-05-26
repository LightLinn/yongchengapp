# 創建serializers.py文件

from rest_framework import serializers
from .models import LifeguardSchedule

class LifeguardScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LifeguardSchedule
        fields = '__all__'
        
        
