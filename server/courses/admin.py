from django.contrib import admin

# Register your models here.

from .models import EnrollmentList, EnrollmentNumbers, AssignedCourse, Course, CourseType

class CourseAdmin(admin.ModelAdmin):
    list_display = ['course_date', 'course_time', 'course_status', 'enrollment_list', 'enrollment_number']
    list_filter = ['course_status']
    search_fields = ['course_date', 'course_time', 'course_status', 'enrollment_list', 'enrollment_number']

admin.site.register(EnrollmentList)
admin.site.register(EnrollmentNumbers)
admin.site.register(AssignedCourse)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseType)


