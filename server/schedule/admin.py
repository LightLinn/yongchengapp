from django.contrib import admin

# Register your models here.

from .models import UnavailableSlot, LifeguardSchedule, CoachAvailableSlot, Location, ScheduleSlot

admin.site.register(UnavailableSlot)
admin.site.register(LifeguardSchedule)
admin.site.register(CoachAvailableSlot)
admin.site.register(Location)
admin.site.register(ScheduleSlot)

