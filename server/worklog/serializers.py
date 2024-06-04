# serializers.py
from rest_framework import serializers
from .models import Worklog, DailyCheckRecord, PeriodicCheckRecord, SpecialCheckRecord, DailyChecklist, PeriodicChecklist, SpecialChecklist

class DailyChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyChecklist
        fields = '__all__'

class PeriodicChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriodicChecklist
        fields = '__all__'

class SpecialChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialChecklist
        fields = '__all__'

class DailyCheckRecordSerializer(serializers.ModelSerializer):
    check_item = DailyChecklistSerializer()

    class Meta:
        model = DailyCheckRecord
        fields = '__all__'

class PeriodicCheckRecordSerializer(serializers.ModelSerializer):
    check_item = PeriodicChecklistSerializer()

    class Meta:
        model = PeriodicCheckRecord
        fields = '__all__'

class SpecialCheckRecordSerializer(serializers.ModelSerializer):
    check_item = SpecialChecklistSerializer()

    class Meta:
        model = SpecialCheckRecord
        fields = '__all__'

class WorklogSerializer(serializers.ModelSerializer):
    daily_checks = DailyCheckRecordSerializer(many=True, read_only=True)
    periodic_checks = PeriodicCheckRecordSerializer(many=True, read_only=True)
    special_checks = SpecialCheckRecordSerializer(many=True, read_only=True)

    class Meta:
        model = Worklog
        fields = '__all__'
