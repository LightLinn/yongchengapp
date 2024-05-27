# 創建serializers.py文件，並將以下內容添加到文件中：

from rest_framework import serializers
from .models import News

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

        