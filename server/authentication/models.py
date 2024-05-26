from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

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

    class Meta:
        db_table = 'user'
        verbose_name = '使用者'
        verbose_name_plural = '使用者'

    def __str__(self):
        return self.username
    
    
# Path: server/authentication/serializers.py
    
    
