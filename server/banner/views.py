from django.shortcuts import render

# Create your views here.

from .models import Banner
from .serializers import BannerSerializer
from rest_framework import viewsets


class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all().order_by('order')
    serializer_class = BannerSerializer



