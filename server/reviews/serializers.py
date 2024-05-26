# 創建serializers.py文件，並將以下代碼添加到其中：
from rest_framework import serializers
from .models import Review, ReviewStage

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ReviewStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewStage
        fields = '__all__'

        
# Path: server/venues/views.py