from django.db import models
from django.contrib.auth.models import Group
from reviews.models import Auditable

# Create your models here.
# 創建管理推送訊息的列表，紀錄推送訊息的標題、內容、類別、狀態、推送方式、建立時間、更新時間、建立者、接收對象

class Notification(Auditable):
    NOTIFY_STATUS_CHOICES = [
        ('待傳送', '待傳送'),
        ('傳送成功', '傳送成功'),
        ('傳送失敗', '傳送失敗'),
        ('取消', '取消'),
    ]

    METHOD_CHOICES = [
        ('LINE', 'LINE'),
        ('MESSENGER', 'MESSENGER'),
        ('EMAIL', 'EMAIL'),
        ('SMS', 'SMS'),
        ('APP', 'APP'),
        ('DISCORD', 'DISCORD'),
    ]

    TYPE_CHOICES = [
        ('全體公告', '全體公告'),
        ('課程公告', '課程公告'),
        ('排班公告', '排班公告'),
        ('維修公告', '維修公告'),
    ]

    title = models.CharField(max_length=255, verbose_name='標題')
    content = models.TextField(verbose_name='內容')
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, verbose_name='類別')
    notify_status = models.CharField(max_length=20, choices=NOTIFY_STATUS_CHOICES, verbose_name='訊息狀態', blank=True, null=True)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, verbose_name='推送方式', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    created_by = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='created_notifications', verbose_name='建立者', blank=True, null=True)
    users = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='notifications', verbose_name='接收者', blank=True, null=True)
    read_status = models.BooleanField(default=False, verbose_name='已讀')

    class Meta:
        db_table = 'notification'
        verbose_name = '推送訊息'
        verbose_name_plural = '推送訊息'

    def __str__(self):
        return self.title

