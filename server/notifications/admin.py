from django.contrib import admin

# Register your models here.

from .models import Notification

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'type', 'notify_status', 'method', 'created_at', 'updated_at', 'created_by', 'users', 'read_status')
    list_filter = ('type', 'notify_status', 'method', 'created_at', 'updated_at', 'created_by', 'users', 'read_status')
    search_fields = ('title', 'content', 'type', 'notify_status', 'method', 'created_at', 'updated_at', 'created_by', 'users', 'read_status')
    ordering = ('created_at',)

admin.site.register(Notification, NotificationAdmin)

