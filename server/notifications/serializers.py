# 創建serializers.py文件，並將以下代碼添加到其中：
from rest_framework import serializers
from .models import Notification, NotificationType

# 創建NotificationSerializer
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

# 創建NotificationTypeSerializer
class NotificationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationType
        fields = '__all__'

# Path: server/notifications/views.py

