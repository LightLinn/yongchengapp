# 創建serializers.py文件，並添加以下代碼：

from rest_framework import serializers
from .models import Worklog

class WorklogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worklog
        fields = '__all__'

        