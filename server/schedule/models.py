from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
# from dateutil.relativedelta import relativedelta
import datetime
from reviews.models import Auditable



# Create your models here.

# 救生員每月班表------------------------------------------------
class UnavailableSlot(Auditable):
    lifeguard = models.ForeignKey('humanresources.Lifeguard', on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField(default='07:00')
    end_time = models.TimeField(default='22:00')
    allow = models.BooleanField(default=None)

    class Meta:
        unique_together = ('lifeguard', 'date', 'start_time', 'end_time')
        db_table = 'unavailable_slot'
        verbose_name = '救生员排假表'
        verbose_name_plural = '救生员排假表'

    def __str__(self):
        return self.lifeguard.user.username
    
    
class LifeguardSchedule(Auditable):
    SCHEDULE_STATUS_CHOICES = [       
        ('待執勤', '待執勤'),
        ('執勤中', '執勤中'),
        ('已執勤', '已執勤'),
        ('未執勤', '未執勤'),
    ]

    lifeguard = models.ForeignKey('humanresources.Lifeguard', on_delete=models.CASCADE, related_name='lifeguard_schedules', verbose_name='救生員')
    venue = models.ForeignKey('venues.Venue', on_delete=models.CASCADE, related_name='lifeguard_schedules', verbose_name='地點', null=True, blank=True)
    date = models.DateField(default=None, verbose_name='日期')
    start_time = models.TimeField(default=None, verbose_name='开始时间')
    end_time = models.TimeField(default=None, verbose_name='结束时间')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    schedule_status = models.CharField(max_length=20, choices=SCHEDULE_STATUS_CHOICES, verbose_name='班表狀態', blank=True, null=True, default='待執勤')
    
    class Meta:
        db_table = 'lifeguard_schedule'
        verbose_name = '救生员月排班表'
        verbose_name_plural = '救生员月排班表'
        unique_together = ['lifeguard', 'venue', 'date', 'start_time', 'end_time']
    
    def __str__(self):
        return f'{self.lifeguard.user.username} - {self.start_time}'

# 教練每週可以安排課程的時間段------------------------------------------------
class Location(Auditable):
    name = models.CharField(max_length=255, verbose_name='名称')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        db_table = 'location'
        verbose_name = '教练授課地点'
        verbose_name_plural = '教练授課地点'
    
    def __str__(self):
        return self.name
    
class CoahcSchedule(models.Model):
    coach = models.ForeignKey('humanresources.Coach', on_delete=models.CASCADE, related_name='schedules')
    location = models.ForeignKey('Location', on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.CharField(max_length=10, choices=[
        ('週一', '週一'),
        ('週二', '週二'),
        ('週三', '週三'),
        ('週四', '週四'),
        ('週五', '週五'),
        ('週六', '週六'),
        ('週日', '週日'),
    ])
    time_slot = models.CharField(max_length=20)
    is_available = models.BooleanField(default=False)

    class Meta:
        unique_together = ('coach', 'location', 'day_of_week', 'time_slot')
        verbose_name = '教練排班'
        verbose_name_plural = '教練排班'

    def __str__(self):
        return f'{self.coach.user.username} - {self.location.name} - {self.day_of_week} - {self.time_slot}'
    
