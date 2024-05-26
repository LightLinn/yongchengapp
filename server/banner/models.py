from django.db import models

# Create your models here.

# 創建儲存前端Banner圖片的資料表
# 圖片存在media/banner/資料夾下

class Banner(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='banner/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title

