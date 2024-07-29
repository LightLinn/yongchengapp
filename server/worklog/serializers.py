# serializers.py
from rest_framework import serializers
from .models import Worklog, DailyCheckRecord, PeriodicCheckRecord, SpecialCheckRecord, DailyChecklist, PeriodicChecklist, SpecialChecklist
from schedule.models import LifeguardSchedule

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
    check_item = DailyChecklistSerializer(read_only=True)

    check_item_id = serializers.PrimaryKeyRelatedField(queryset=DailyChecklist.objects.all(), source='check_item')
    class Meta:
        model = DailyCheckRecord
        fields = '__all__'

class PeriodicCheckRecordSerializer(serializers.ModelSerializer):
    check_item = DailyChecklistSerializer(read_only=True)

    check_item_id = serializers.PrimaryKeyRelatedField(queryset=PeriodicChecklist.objects.all(), source='check_item')
    class Meta:
        model = PeriodicCheckRecord
        fields = '__all__'

class SpecialCheckRecordSerializer(serializers.ModelSerializer):
    check_item = DailyChecklistSerializer(read_only=True)

    check_item_id = serializers.PrimaryKeyRelatedField(queryset=SpecialChecklist.objects.all(), source='check_item')
    class Meta:
        model = SpecialCheckRecord
        fields = '__all__'

class LifeguardScheduleSerializer(serializers.ModelSerializer):
    venue = serializers.SerializerMethodField()
    lifeguard = serializers.SerializerMethodField()

    class Meta:
        model = LifeguardSchedule
        fields = '__all__'

    def get_venue(self, obj):
        return obj.venue.name
    
    def get_lifeguard(self, obj):
        return obj.lifeguard.user.username

class WorklogSerializer(serializers.ModelSerializer):
    special_check_record = serializers.SerializerMethodField()
    periodic_check_record = serializers.SerializerMethodField()
    daily_check_record = serializers.SerializerMethodField()
    duty = LifeguardScheduleSerializer(read_only=True)

    duty_id = serializers.PrimaryKeyRelatedField(queryset=LifeguardSchedule.objects.all(), source='duty', write_only=True)

    class Meta:
        model = Worklog
        fields = '__all__'

    # 取得fk special_check_record的資料
    def get_special_check_record(self, obj):
        special_check_records = SpecialCheckRecord.objects.filter(worklog=obj)
        return SpecialCheckRecordSerializer(special_check_records, many=True).data

    def get_periodic_check_record(self, obj):
        periodic_check_records = PeriodicCheckRecord.objects.filter(worklog=obj)
        return PeriodicCheckRecordSerializer(periodic_check_records, many=True).data
    
    def get_daily_check_record(self, obj):
        daily_check_records = DailyCheckRecord.objects.filter(worklog=obj)
        return DailyCheckRecordSerializer(daily_check_records, many=True).data
    