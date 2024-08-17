# 創建serializers.py文件，並將以下代碼添加到其中：
from rest_framework import serializers
from .models import Notification

# 創建NotificationSerializer
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


# Path: server/notifications/views.py

