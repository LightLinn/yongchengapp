from django.db import models
from django.contrib.auth.models import Group
from reviews.models import Auditable

# Create your models here.
# 創建管理推送訊息的列表，紀錄推送訊息的標題、內容、類別、狀態、推送方式、建立時間、更新時間、建立者、接收對象

class Notification(Auditable):
    NOTIFY_STATUS_CHOICES = [
        ('pending', '待傳送'),
        ('success', '成功'),
        ('failed', '失敗'),
        ('cancelled', '取消'),
    ]
    title = models.CharField(max_length=255, verbose_name='標題')
    content = models.TextField(verbose_name='內容')
    type = models.ForeignKey('NotificationType', on_delete=models.CASCADE, verbose_name='類別')
    notify_status = models.CharField(max_length=20, choices=NOTIFY_STATUS_CHOICES, verbose_name='訊息狀態', blank=True, null=True)
    method = models.ForeignKey('NotificationMethod', on_delete=models.CASCADE, verbose_name='推送方式', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    created_by = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='created_notifications', verbose_name='建立者', blank=True, null=True)
    users = models.ManyToManyField('authentication.CustomUser', related_name='notifications', verbose_name='接收對象', blank=True)
    read_status = models.BooleanField(default=False, verbose_name='已讀')

    class Meta:
        db_table = 'notification'
        verbose_name = '推送訊息'
        verbose_name_plural = '推送訊息'

    def __str__(self):
        return self.title

    
class NotificationType(Auditable):
    name = models.CharField(max_length=255, verbose_name='類別名稱', unique=True)
    description = models.TextField(verbose_name='類別描述')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'notification_type'
        verbose_name = '訊息類別'
        verbose_name_plural = '訊息類別'

    def __str__(self):
        return self.name

class NotificationMethod(Auditable):
    name = models.CharField(max_length=255, verbose_name='推送方式')
    description = models.TextField(verbose_name='推送方式描述')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'notification_method'
        verbose_name = '推送方式'
        verbose_name_plural = '推送方式'

    def __str__(self):
        return self.name
    
# Path: server/notifications/serializers.py

'''
在前端（React Native）中，你可能需要先從後端取得所有的使用者和群組資料，以便讓使用者選擇郵件的收件人。你可以設計一個下拉選單或自動完成欄位來顯示這些選項。
當使用者選擇了收件人並撰寫了郵件後，你可以將郵件的資訊（如主題和內容）以及收件人的 ID 列表發送到後端。如果使用者選擇了一個群組，你可以將群組的 ID 發送到後端。
以下是一個基本的例子：

// 假設你已經從後端取得了所有的使用者和群組
let users = [...];
let groups = [...];

// 使用者選擇了一些收件人和群組
let selectedUserIds = [...];
let selectedGroupIds = [...];

// 使用者撰寫了郵件
let email = {
  subject: '...',
  message: '...',
};

// 發送郵件資訊和收件人的 ID 列表到後端
fetch('https://your-api.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...email,
    users: selectedUserIds,
    groups: selectedGroupIds,
  }),
});
'''