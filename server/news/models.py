from django.db import models

# Create your models here.

class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='news/', null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    author = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='news')

    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'news'
        verbose_name = '消息'
        verbose_name_plural = '消息'