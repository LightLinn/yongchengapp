from django.apps import AppConfig


class AttendanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'attendance'
    verbose_name = '簽到管理'

    def ready(self):
        from .scheduler import start_scheduler
        start_scheduler()