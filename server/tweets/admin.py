from django.contrib import admin

# Register your models here.

from .models import Tweet, TweetComment, TweetLike, TweetCommentLike

admin.site.register(Tweet)
admin.site.register(TweetComment)
admin.site.register(TweetLike)
admin.site.register(TweetCommentLike)
