# 創建serializers.py文件，並將以下代碼添加到其中：

from rest_framework import serializers
from .models import Tweet, TweetComment, TweetLike, TweetCommentLike

# 創建TweetSerializer
class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = '__all__'

# 創建TweetLikeSerializer
class TweetLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TweetLike
        fields = '__all__'

# 創建TweetCommentSerializer
class TweetCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TweetComment
        fields = '__all__'

# 創建TweetCommentLikeSerializer
class TweetCommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TweetCommentLike
        fields = '__all__'

        