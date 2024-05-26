from django.shortcuts import render
# import permissions
from authentication.permissions import *

# Create your views here.

# 創建viewsets.py

from rest_framework import viewsets
from .models import UserActivity
from .serializers import UserActivitySerializer

class UserActivityViewSet(viewsets.ModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsManagerGroup(), IsAdministratorGroup()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


