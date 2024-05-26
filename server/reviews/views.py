from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import Review, ReviewStage
from .serializers import ReviewSerializer, ReviewStageSerializer
from authentication.permissions import *

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

    def approve(self, request, *args, **kwargs):
        review = self.get_object()
        review.approve()
        return Response({'status': 'approved'})

    def reject(self, request, *args, **kwargs):
        review = self.get_object()
        review.reject()
        return Response({'status': 'rejected'})

class ReviewStageViewSet(viewsets.ModelViewSet):
    queryset = ReviewStage.objects.all()
    serializer_class = ReviewStageSerializer

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]


# Path: server/venues/urls.py