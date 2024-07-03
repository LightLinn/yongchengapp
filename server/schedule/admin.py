from django.contrib import admin

# Register your models here.

from .models import UnavailableSlot, LifeguardSchedule, Location, CoahcSchedule

class UnavailableSlotAdmin(admin.ModelAdmin):
    list_display = ('lifeguard', 'date', 'start_time', 'end_time')
    search_fields = ('lifeguard', 'date', 'start_time', 'end_time')
    list_filter = ('lifeguard', 'date', 'start_time', 'end_time')
    

class LifeguardScheduleAdmin(admin.ModelAdmin):
    list_display = ('lifeguard', 'venue', 'date', 'start_time', 'end_time')
    search_fields = ('lifeguard', 'venue', 'date', 'start_time', 'end_time')
    list_filter = ('lifeguard', 'venue', 'date', 'start_time', 'end_time')
    

admin.site.register(UnavailableSlot, UnavailableSlotAdmin)
admin.site.register(LifeguardSchedule, LifeguardScheduleAdmin)
admin.site.register(Location)
admin.site.register(CoahcSchedule)

