from django.db import models
from django.contrib.auth import get_user_model
from reviews.models import Auditable

User = get_user_model()

# Create your models here.

# 創建動態貼文所需要的資料模型

class Tweet(Auditable):
    content = models.TextField(max_length=150, verbose_name='貼文內容')
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='tweets', verbose_name='用戶')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'tweet'
        verbose_name = '貼文'
        verbose_name_plural = '貼文'

    def __str__(self):
        return self.content
    
    @property 
    def number_of_likes(self):
        return TweetLike.objects.filter(tweet=self).count()
    
    @property 
    def number_of_comments(self):
        return TweetComment.objects.filter(tweet=self).count()
    
class TweetLike(Auditable):
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name='likes', verbose_name='貼文')
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='tweet_likes', verbose_name='用戶')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'tweet_like'
        verbose_name = '貼文讚'
        verbose_name_plural = '貼文讚'

    def __str__(self):
        return f'{self.tweet.content} - {self.user.username}'
    
class TweetComment(Auditable):
    tweet = models.ForeignKey('Tweet', on_delete=models.CASCADE, related_name='comments', verbose_name='貼文')
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='comments', verbose_name='用戶')
    content = models.TextField(verbose_name='評論內容')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'tweet_comment'
        verbose_name = '貼文評論'
        verbose_name_plural = '貼文評論'

    def __str__(self):
        return f'{self.tweet.content} - {self.user.username}'
    
class TweetCommentLike(models.Model):
    comment = models.ForeignKey(TweetComment, on_delete=models.CASCADE, related_name='likes', verbose_name='評論')
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='comment_likes', verbose_name='用戶')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        db_table = 'tweet_comment_like'
        verbose_name = '評論讚'
        verbose_name_plural = '評論讚'

    def __str__(self):
        return f'{self.comment.content} - {self.user.username}'
    
# Path serializers.py
