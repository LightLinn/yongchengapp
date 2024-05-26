from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('tweets', views.TweetViewSet)
router.register('tweet-likes', views.TweetLikeViewSet)
router.register('tweet-comments', views.TweetCommentViewSet)
router.register('tweet-comment-likes', views.TweetCommentLikeViewSet)

urlpatterns = [
  path('', include(router.urls))  
]