from django.shortcuts import render

# Create your views here.

# 創建views.py文件，並將以下代碼添加到其中：

from rest_framework import viewsets
from .models import TweetComment, TweetCommentLike, Tweet, TweetLike
from .serializers import TweetCommentSerializer, TweetCommentLikeSerializer, TweetSerializer, TweetLikeSerializer
from authentication.permissions import *

# 創建TweetViewSet
class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer

# 創建TweetLikeViewSet
class TweetLikeViewSet(viewsets.ModelViewSet):
    queryset = TweetLike.objects.all()
    serializer_class = TweetLikeSerializer

# 創建TweetCommentViewSet
class TweetCommentViewSet(viewsets.ModelViewSet):
    queryset = TweetComment.objects.all()
    serializer_class = TweetCommentSerializer

# 創建TweetCommentLikeViewSet
class TweetCommentLikeViewSet(viewsets.ModelViewSet):
    queryset = TweetCommentLike.objects.all()
    serializer_class = TweetCommentLikeSerializer

    