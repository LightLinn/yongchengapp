from django.db import models
from reviews.models import Auditable

# Create your models here.

# 創建課程簽到紀錄表、簽到狀態表
# 課程簽到紀錄表只須記載簽到者，不用區分教練與學生
# 創建員工出勤簽到表


class Attendance(Auditable):
    ATTEND_STATUS_CHOICES = [
        ('signed_in', '簽到'),
        ('signed_in_late', '補簽'),
        ('admin_signed_in_late', '管理者補簽'),
        ('not_verified', '未通過驗證'),
        ('not_signed_in', '未簽到'),
    ]
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='attendances', verbose_name='使用者')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='attendances', verbose_name='課程')
    attend_status = models.CharField(max_length=20, choices=ATTEND_STATUS_CHOICES, verbose_name='簽到狀態', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    check_code = models.CharField(max_length=255, verbose_name='驗證碼', blank=True, null=True)
    check_note = models.TextField(verbose_name='驗證備註', blank=True, null=True)

    class Meta:
        db_table = 'attendance'
        verbose_name = '課程簽到紀錄'
        verbose_name_plural = '課程簽到紀錄'

    def __str__(self):
        return self.user.username
    
# 救生員簽到簽退紀錄表
class LifeguardAttendance(Auditable):
    ATTEND_STATUS_CHOICES = [
        ('signed_in', '簽到'),
        ('signed_in_late', '補簽'),
        ('admin_signed_in_late', '管理者補簽'),
        ('not_signed_in', '未簽到'),
        ('signed_out', '簽退'),
        ('signed_out_late', '補簽退'),
        ('admin_signed_out_late', '管理者補簽退'),
        ('not_signed_out', '未簽退'),
        ('not_verified', '未通過驗證'),
    ]
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='lifeguard_attendances', verbose_name='使用者')
    attend_status = models.CharField(max_length=50, choices=ATTEND_STATUS_CHOICES, verbose_name='簽到狀態', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    latitude = models.FloatField(verbose_name='緯度', default=0.0, blank=True, null=True)
    longitude = models.FloatField(verbose_name='經度', default=0.0, blank=True, null=True)
    check_note = models.TextField(verbose_name='驗證備註', blank=True, null=True)
    schedule = models.ForeignKey('schedule.LifeguardSchedule', on_delete=models.CASCADE, related_name='lifeguard_attendances', verbose_name='排班')

    class Meta:
        db_table = 'lifeguard_attendance'
        verbose_name = '救生員出勤紀錄'
        verbose_name_plural = '救生員出勤紀錄'

    def __str__(self):
        return self.user.username

# 員工簽到簽退紀錄表

class StaffAttendance(Auditable):
    ATTEND_STATUS_CHOICES = [
        ('signed_in', '簽到'),
        ('signed_in_late', '補簽'),
        ('admin_signed_in_late', '管理者補簽'),
        ('not_signed_in', '未簽到'),
        ('signed_out', '簽退'),
        ('signed_out_late', '補簽退'),
        ('admin_signed_out_late', '管理者補簽退'),
        ('not_signed_out', '未簽退'),
        ('not_verified', '未通過驗證'),
    ]
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='staff_attendances', verbose_name='使用者')
    attend_status = models.CharField(max_length=50, choices=ATTEND_STATUS_CHOICES, verbose_name='簽到狀態', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    latitude = models.FloatField(verbose_name='緯度', default=0.0, blank=True, null=True)
    longitude = models.FloatField(verbose_name='經度', default=0.0, blank=True, null=True)
    check_note = models.TextField(verbose_name='驗證備註', blank=True, null=True)
    # schedule = models.ForeignKey('schedules.Schedule', on_delete=models.CASCADE, related_name='staff_attendances', verbose_name='排班')
    

    class Meta:
        db_table = 'staff_attendance'
        verbose_name = '員工出勤紀錄'
        verbose_name_plural = '員工出勤紀錄'

    def __str__(self):
        return self.user.username
    
# Path: server/attendance/serializers.py