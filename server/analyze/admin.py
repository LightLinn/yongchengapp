from django.contrib import admin

# Register your models here.

from .models import UserActivity

admin.site.register(UserActivity)


