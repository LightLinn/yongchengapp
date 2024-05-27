from django.shortcuts import render

# Create your views here.

# 創建views.py文件

from rest_framework import viewsets
from .models import News
from .serializers import NewsSerializer

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.filter(is_deleted=False, is_published=True)
    serializer_class = NewsSerializer

