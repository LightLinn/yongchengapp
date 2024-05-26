from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
# from dateutil.relativedelta import relativedelta
import datetime
from reviews.models import Auditable



# Create your models here.

# 創建授課教練排班表、救生員排班表、救生員排假表

# 救生員每月班表------------------------------------------------
class UnavailableSlot(Auditable):
    lifeguard = models.ForeignKey('humanresources.Lifeguard', on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    allow = models.BooleanField(default=None)

    class Meta:
        unique_together = ('lifeguard', 'date', 'start_time', 'end_time')

    def __str__(self):
        return self.lifeguard.user.username
    
    # def save(self, *args, **kwargs):
    #     start_datetime = timezone.make_aware(datetime.combine(self.date, self.start_time))
    #     next_month = (timezone.now() + relativedelta(months=1)).replace(day=1)

    #     if not next_month <= start_datetime < (next_month + relativedelta(months=1)):
    #         raise ValidationError("只能創建下一個月的資料")
    #     super().save(*args, **kwargs)
    
class LifeguardSchedule(Auditable):
    lifeguard = models.ForeignKey('humanresources.Lifeguard', on_delete=models.CASCADE, related_name='lifeguard_schedules', verbose_name='救生员')
    venue = models.ForeignKey('venues.Venue', on_delete=models.CASCADE, related_name='lifeguard_schedules', verbose_name='地点', null=True, blank=True)
    date = models.DateField(default=None, verbose_name='日期')
    start_time = models.TimeField(default=None, verbose_name='开始时间')
    end_time = models.TimeField(default=None, verbose_name='结束时间')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        db_table = 'lifeguard_schedule'
        verbose_name = '救生员月排班表'
        verbose_name_plural = '救生员月排班表'
        unique_together = ['lifeguard', 'venue', 'date', 'start_time', 'end_time']
    
    def __str__(self):
        return f'{self.lifeguard.user.username} - {self.start_time}'

# 教練每週可以安排課程的時間段------------------------------------------------
class CoachAvailableSlot(Auditable):
    DAY_OF_WEEK_CHOICES = [
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
        (7, 'Sunday'),
    ]

    coach = models.ForeignKey('humanresources.Coach', on_delete=models.CASCADE, related_name='coach_schedules', verbose_name='教练')
    location = models.ForeignKey('Location', on_delete=models.CASCADE, related_name='coach_schedules', verbose_name='地点', null=True, blank=True)
    schedule_slot = models.ForeignKey('ScheduleSlot', on_delete=models.CASCADE, related_name='coach_schedules', verbose_name='时间段', null=True, blank=True)
    day_of_week = models.IntegerField(choices=DAY_OF_WEEK_CHOICES, verbose_name='星期', default=1)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        db_table = 'coach_available_slot'
        verbose_name = '教练可上班週排表'
        verbose_name_plural = '教练可上班週排表'
        unique_together = ['coach', 'day_of_week', 'schedule_slot', 'location']
    
    def __str__(self):
        return f'{self.coach.user.username} - {self.start_time}'
    
class Location(Auditable):
    name = models.CharField(max_length=255, verbose_name='名称')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        db_table = 'location'
        verbose_name = '授課地点'
        verbose_name_plural = '授課地点'
    
    def __str__(self):
        return self.name
    
class ScheduleSlot(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        db_table = 'schedule_slot'
        verbose_name = '排班时间段'
        verbose_name_plural = '排班时间段'

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"
    
# Path: server/humanresources/serializers.py