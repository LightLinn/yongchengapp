from django.contrib import admin

# Register your models here.

from .models import UnavailableSlot, LifeguardSchedule, Location, CoahcSchedule

admin.site.register(UnavailableSlot)
admin.site.register(LifeguardSchedule)
admin.site.register(Location)
admin.site.register(CoahcSchedule)

