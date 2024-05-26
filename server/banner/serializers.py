# 創建serializers.py文件，並編寫以下代碼

from rest_framework import serializers
from .models import Banner

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'
