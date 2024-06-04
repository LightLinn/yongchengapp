from django.contrib import admin

# Register your models here.

from .models import Worklog, SpecialCheckRecord, PeriodicCheckRecord, DailyCheckRecord, DailyChecklist, PeriodicChecklist, SpecialChecklist

class WorklogAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'is_final')
    list_filter = ('id', 'title', 'is_final')
    search_fields = ('id', 'title', 'is_final')

admin.site.register(Worklog, WorklogAdmin)
admin.site.register(SpecialCheckRecord)
admin.site.register(PeriodicCheckRecord)
admin.site.register(DailyCheckRecord)
admin.site.register(DailyChecklist)
admin.site.register(PeriodicChecklist)
admin.site.register(SpecialChecklist)



