"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/yc/admin/', admin.site.urls),
    path('api/yc/', include('authentication.urls')),
    path('api/yc/', include('courses.urls')),
    path('api/yc/', include('venues.urls')),
    path('api/yc/', include('attendance.urls')),
    path('api/yc/', include('reviews.urls')),
    path('api/yc/', include('finance.urls')),
    path('api/yc/', include('store.urls')),
    path('api/yc/', include('support.urls')),
    path('api/yc/', include('notifications.urls')),
    path('api/yc/', include('subscriptions.urls')),
    path('api/yc/', include('humanresources.urls')),
    path('api/yc/', include('banner.urls')),
    path('api/yc/', include('schedule.urls')),
    path('api/yc/', include('analyze.urls')),
    path('api/yc/', include('tweets.urls')),
    path('api/yc/', include('worklog.urls')),
    path('api/yc/', include('teachlog.urls')),
    path('api/yc/', include('banner.urls')),
    path('api/yc/', include('news.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
