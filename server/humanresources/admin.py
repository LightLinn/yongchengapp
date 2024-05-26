from django.contrib import admin

# Register your models here.

from .models import Employee, Coach, Lifeguard, VenueManager, Salary, Performance, SalaryRange

admin.site.register(Employee)
admin.site.register(Coach)
admin.site.register(Lifeguard)
admin.site.register(VenueManager)
admin.site.register(Salary)
admin.site.register(SalaryRange)
admin.site.register(Performance)
