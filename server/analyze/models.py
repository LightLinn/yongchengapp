from django.db import models
from reviews.models import Auditable

# Create your models here.

class UserActivity(Auditable):
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, verbose_name='用戶')
    activity_type = models.CharField(max_length=255, verbose_name='活動類型')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='時間戳')

    class Meta:
        db_table = 'user_activity'
        verbose_name = '使用者活動'
        verbose_name_plural = '使用者活動'
