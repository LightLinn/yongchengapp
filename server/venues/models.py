from django.db import models
from django.utils import timezone
from reviews.models import Auditable


# Create your models here.

# 創建場地表、場地狀態表、場地使用紀錄表、巡檢紀錄表、報修申請表

class Venue(Auditable):
    name = models.CharField(max_length=255, verbose_name='場地名稱')
    description = models.TextField(verbose_name='場地描述', blank=True, null=True) 
    capacity = models.IntegerField(verbose_name='容量')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    weekday_open_time = models.TimeField(verbose_name='平日開放時間', blank=True, null=True)
    weekday_close_time = models.TimeField(verbose_name='平日關閉時間', blank=True, null=True)
    holiday_open_time = models.TimeField(verbose_name='假日開放時間', blank=True, null=True)
    holiday_close_time = models.TimeField(verbose_name='假日關閉時間', blank=True, null=True)
    longitude = models.FloatField(verbose_name='經度', default=0)
    latitude = models.FloatField(verbose_name='緯度', default=0)
    address = models.CharField(max_length=255, verbose_name='地址', default='', blank=True, null=True)
    managers = models.ManyToManyField('authentication.CustomUser', related_name='venues', verbose_name='場地管理者')

    class Meta:
        db_table = 'venue'
        verbose_name = '場地'
        verbose_name_plural = '場地'

    def __str__(self):
        return self.name
    
class VenueUsageRecord(Auditable):
    VENUE_STATUS_CHOICES = [
        ('not_used', '未使用'),
        ('booked', '已預訂'),
        ('in_use', '使用中'),
        ('repairing', '維修中'),
        ('closed', '已關閉'),
    ]
    venue = models.ForeignKey('Venue', on_delete=models.CASCADE, related_name='venue_usage_records', verbose_name='場地')
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='venue_usage_records', verbose_name='使用者')
    venue_status = models.CharField(max_length=20, choices=VENUE_STATUS_CHOICES, verbose_name='場地狀態', default='not_used')
    start_time = models.DateTimeField(verbose_name='開始時間')
    end_time = models.DateTimeField(verbose_name='結束時間')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='venue_usage_records', verbose_name='課程', blank=True, null=True)

    class Meta:
        db_table = 'venue_usage_record'
        verbose_name = '場地使用紀錄'
        verbose_name_plural = '場地使用紀錄'

    def __str__(self):
        return f'{self.venue.name} - {self.user.username}'
    
    # 若當前時間是否在預約時間範圍內，若是則Status改為in_use，未在範圍內則改為not_used
    # 若Status為closed 或 repairing 則不進行檢查
    def check_status(self):
        if self.status == 'closed' or self.status == 'repairing':
            return
        now = timezone.now()
        if now >= self.start_time and now <= self.end_time:
            self.status = 'in_use'
        else:
            self.status = 'not_used'
        self.save()
    
class VenueInspectionRecord(Auditable):
    venue = models.ForeignKey('Venue', on_delete=models.CASCADE, related_name='venue_inspection_records', verbose_name='場地')
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='venue_inspection_records', verbose_name='使用者')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'venue_inspection_record'
        verbose_name = '巡檢紀錄'
        verbose_name_plural = '巡檢紀錄'

    def __str__(self):
        return f'{self.venue.name} - {self.user.username}'
    
class VenueRepairRequest(Auditable):
    REPAIR_STATUS_CHOICES = [
        ('not_processed', '未處理'),
        ('processing', '處理中'),
        ('processed', '已處理'),
    ]
    venue = models.ForeignKey('Venue', on_delete=models.CASCADE, related_name='venue_repair_requests', verbose_name='場地')
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='venue_repair_requests', verbose_name='使用者')
    repair_status = models.CharField(max_length=20, choices=REPAIR_STATUS_CHOICES, verbose_name='報修狀態', default='not_processed')
    title = models.CharField(max_length=255, verbose_name='報修標題', blank=True, null=True)
    description = models.TextField(verbose_name='報修描述')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'venue_repair_request'
        verbose_name = '報修申請'
        verbose_name_plural = '報修申請'

    def __str__(self):
        return f'{self.venue.name} - {self.user.username}'

#--------------------------------------------

class VenueBooking(Auditable):
    venue = models.ForeignKey('Venue', on_delete=models.CASCADE, related_name='venue_bookings', verbose_name='場地')
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='venue_bookings', verbose_name='使用者')
    start_time = models.DateTimeField(verbose_name='開始時間')
    end_time = models.DateTimeField(verbose_name='結束時間')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'venue_booking'
        verbose_name = '場地預約'
        verbose_name_plural = '場地預約'

    def __str__(self):
        return f'{self.venue.name} - {self.user.username}'
    
class VenueBookingStatus(Auditable):
    name = models.CharField(max_length=255, verbose_name='狀態名稱')
    description = models.TextField(verbose_name='狀態描述')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'venue_booking_status'
        verbose_name = '場地預約狀態'
        verbose_name_plural = '場地預約狀態'

    def __str__(self):
        return self.name
    
# Path: server/venues/serializers.py