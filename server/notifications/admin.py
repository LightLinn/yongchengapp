from django.contrib import admin

# Register your models here.

from .models import Notification, NotificationType, NotificationMethod

admin.site.register(Notification)
admin.site.register(NotificationType)
admin.site.register(NotificationMethod)

