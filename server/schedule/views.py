from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from .models import LifeguardSchedule, CoahcSchedule, Location, UnavailableSlot
from .serializers import LifeguardScheduleSerializer, CoachScheduleSerializer, LocationSerializer, UnavailableSlotSerializer
from authentication.permissions import *
import datetime

class UnavailableSlotViewSet(viewsets.ModelViewSet):
    queryset = UnavailableSlot.objects.all()
    serializer_class = UnavailableSlotSerializer

    def get_queryset(self):
        lifeguard_id = self.request.query_params.get('lifeguard_id')
        queryset = self.queryset
        if lifeguard_id:
            queryset = queryset.filter(lifeguard_id=lifeguard_id)
        return queryset

    def create(self, request, *args, **kwargs):
        today = timezone.now().date()
        next_month = today.replace(day=1) + datetime.timedelta(days=32)
        next_month = next_month.replace(day=1)
        if today.day > 25:
            return Response({'detail': '次月班表規劃中'}, status=400)
        
        data = request.data
        data['date'] = next_month
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)


class LifeguardScheduleViewSet(viewsets.ModelViewSet):
    queryset = LifeguardSchedule.objects.all()
    serializer_class = LifeguardScheduleSerializer
    # permission_classes = [permissions.IsAuthenticated]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class CoachScheduleViewSet(viewsets.ModelViewSet):
    queryset = CoahcSchedule.objects.all()
    serializer_class = CoachScheduleSerializer

    def get_queryset(self):
        coach_id = self.request.query_params.get('coach_id')
        location_id = self.request.query_params.get('location_id')
        queryset = self.queryset
        if coach_id and location_id:
            queryset = queryset.filter(coach_id=coach_id, location_id=location_id)
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        schedule, created = CoahcSchedule.objects.update_or_create(
            coach_id=data['coach'],
            location_id=data['location'],
            day_of_week=data['day_of_week'],
            time_slot=data['time_slot'],
            defaults={'is_available': data['is_available']}
        )
        if created:
            return Response({'status': 'created'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'updated'}, status=status.HTTP_200_OK)


    