from django.contrib import admin

# Register your models here.

from .models import Attendance, LifeguardAttendance, StaffAttendance

admin.site.register(Attendance)
admin.site.register(LifeguardAttendance)
admin.site.register(StaffAttendance)