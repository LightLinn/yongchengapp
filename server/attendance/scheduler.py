# myapp/scheduler.py

from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone
from attendance.models import Attendance
from courses.models import Course

def check_attendance_records():
    now = timezone.now()
    # 取得前一日所有課程，如今日20240202，則取得20240201的課程
    courses = Course.objects.filter(course_date=now.date() - timezone.timedelta(days=1))
    for course in courses:
        attendances = Attendance.objects.filter(course=course)
        if not attendances.exists():
            print(f'課程 {course.id} 沒有簽到記錄')
        else:
            pass
            

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_attendance_records, 'cron', hour=0, minute=10)  # 每天午夜運行
    scheduler.start()
