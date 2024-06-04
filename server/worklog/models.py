from django.db import models
from reviews.models import Auditable

# Create your models here.

class Worklog(Auditable):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    duty = models.ForeignKey('schedule.LifeguardSchedule', on_delete=models.CASCADE, verbose_name='值班人員', blank=True, null=True)
    usage_count = models.PositiveIntegerField(verbose_name='使用人數', default=0)
    daily_checks = models.ManyToManyField('DailyCheckRecord', blank=True)
    periodic_checks = models.ManyToManyField('PeriodicCheckRecord', blank=True)
    special_checks = models.ManyToManyField('SpecialCheckRecord', blank=True)
    is_final = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'worklog'
        ordering = ['-created_at']
        verbose_name = '工作日誌'
        verbose_name_plural = '工作日誌'


# 每日巡檢項目，針對項目給予評級「優、尚可、需改善」，以及備註欄位
class DailyChecklist(models.Model):
    item = models.CharField(max_length=100, verbose_name='項目')
    description = models.TextField(verbose_name='描述', blank=True, null=True)
    
    def __str__(self):
        return self.item 
    
    class Meta:
        db_table = 'daily_checklist'
        verbose_name = '每日檢點'
        verbose_name_plural = '每日檢點'

class DailyCheckRecord(Auditable):
    created_at = models.DateTimeField(auto_now_add=True)
    check_item = models.ForeignKey(DailyChecklist, on_delete=models.CASCADE, verbose_name='每日檢點', blank=True, null=True)
    score = models.IntegerField(choices=[(0, '優'), (1, '尚可'), (2, '需改善')], default=0)
    duty = models.ForeignKey('schedule.LifeguardSchedule', on_delete=models.CASCADE, verbose_name='值班人員')
    remark = models.TextField(verbose_name='備註', blank=True, null=True)

    class Meta:
        db_table = 'daily_check_record'
        verbose_name = '每日檢點記錄'
        verbose_name_plural = '每日檢點記錄'
    
    def __str__(self):
        return self.check_item.item if self.check_item else ''


# 定時巡檢項目，紀錄溫度與含氧量，包含時間欄位
class PeriodicChecklist(models.Model):
    item = models.CharField(max_length=100, verbose_name='項目')
    description = models.TextField(verbose_name='描述', blank=True, null=True)
    
    def __str__(self):
        return self.item
    
    class Meta:
        db_table = 'periodic_checklist'
        verbose_name = '定時檢點'
        verbose_name_plural = '定時檢點'

class PeriodicCheckRecord(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    check_item = models.ForeignKey(PeriodicChecklist, on_delete=models.CASCADE, verbose_name='定時檢點', blank=True, null=True)
    value = models.FloatField(verbose_name='數值')
    pool = models.CharField(max_length=100, verbose_name='池號', blank=True, null=True)
    duty = models.ForeignKey('schedule.LifeguardSchedule', on_delete=models.CASCADE, verbose_name='值班人員')
    remark = models.TextField(verbose_name='備註', blank=True, null=True)

    class Meta:
        db_table = 'periodic_check_record'
        verbose_name = '定時檢點記錄'
        verbose_name_plural = '定時檢點記錄'

    def __str__(self):
        return self.check_item.item if self.check_item else ''


# 特殊處理項目，紀錄指定項目的補充、劑量、數量，包含時間欄位
class SpecialChecklist(models.Model):
    item = models.CharField(max_length=100, verbose_name='項目')
    description = models.TextField(verbose_name='描述', blank=True, null=True)
    
    def __str__(self):
        return self.item
    
    class Meta:
        db_table = 'special_checklist'
        verbose_name = '特殊處理檢點'
        verbose_name_plural = '特殊處理檢點'

class SpecialCheckRecord(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    check_item = models.ForeignKey(SpecialChecklist, on_delete=models.CASCADE, verbose_name='特殊處理檢點', blank=True, null=True)
    quantity = models.FloatField(verbose_name='數量')
    start_time = models.DateTimeField(verbose_name='開始時間', blank=True, null=True)
    end_time = models.DateTimeField(verbose_name='結束時間', blank=True, null=True)
    duty = models.ForeignKey('schedule.LifeguardSchedule', on_delete=models.CASCADE, verbose_name='值班人員')
    remark = models.TextField(verbose_name='備註', blank=True, null=True)

    class Meta:
        db_table = 'special_check_record'
        verbose_name = '特殊處理檢點記錄'
        verbose_name_plural = '特殊處理檢點記錄'

    def __str__(self):
        return self.check_item.item if self.check_item else ''


'''

'''