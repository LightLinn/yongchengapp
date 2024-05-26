from django.contrib import admin

# Register your models here.

from .models import EnrollmentList, EnrollmentNumbers, AssignedCourse, Course, CourseType

admin.site.register(EnrollmentList)
admin.site.register(EnrollmentNumbers)
admin.site.register(AssignedCourse)
admin.site.register(Course)
admin.site.register(CourseType)