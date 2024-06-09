from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser, Group

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=11, unique=True, null=True, blank=True, verbose_name='手機號碼')
    sex = models.CharField(
        max_length=10,
        choices=(('男', '男'), ('女', '女'), ('未知', '未知')),
        default='未知',
        verbose_name='性別'
    )
    birthday = models.DateField(null=True, blank=True, verbose_name='生日')
    address = models.CharField(max_length=255, null=True, blank=True, verbose_name='地址')
    avatar = models.ImageField(upload_to='avatar/', null=True, blank=True, verbose_name='頭像')
    nickname = models.CharField(max_length=255, null=True, blank=True, verbose_name='暱稱')

    class Meta:
        db_table = 'user'
        verbose_name = '使用者'
        verbose_name_plural = '使用者'

    def __str__(self):
        return self.username
    
class ScreenPermissions(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    screen_name = models.ForeignKey('authentication.Screen', on_delete=models.CASCADE, blank=True, null=True)
    can_view = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = ('group', 'screen_name')
        db_table = 'ScreenPermissions'
        verbose_name = '頁面渲染權限'
        verbose_name_plural = '頁面渲染權限'


    def __str__(self):
        return f"{self.group.name} - {self.screen_name}"

class Screen(models.Model):
    screen_name = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'Screen'
        verbose_name = '頁面'
        verbose_name_plural = '頁面'

    def __str__(self):
        return self.screen_name
    
# Path: server/authentication/serializers.py
    
SCREEN_NAMES = (
        ('admin_screen', 'Admin Management'),
        ('review_screen', 'Review Management'),
        ('venue_screen', 'Venue Management'),
        ('attendance_screen', 'Attendance Management'),
        ('news_screen', 'News Management'),
        ('notification_screen', 'Notification Management'),
        {'worklog_screen', 'Worklog Management'},
        {'repair_screen', 'Repair Management'},
        {'checkin_screen', 'Check Management'},
    )
