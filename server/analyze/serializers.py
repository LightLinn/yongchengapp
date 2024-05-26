# 創建serializer.py文件，並添加以下代碼：

from rest_framework import serializers
from .models import UserActivity

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'activity_type', 'timestamp']