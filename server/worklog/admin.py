from django.contrib import admin

# Register your models here.

from .models import Worklog, SpecialCheckRecord, PeriodicCheckRecord, DailyCheckRecord, DailyChecklist, PeriodicChecklist, SpecialChecklist

admin.site.register(Worklog)
admin.site.register(SpecialCheckRecord)
admin.site.register(PeriodicCheckRecord)
admin.site.register(DailyCheckRecord)
admin.site.register(DailyChecklist)
admin.site.register(PeriodicChecklist)
admin.site.register(SpecialChecklist)

