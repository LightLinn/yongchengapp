from django.contrib.auth import get_user_model
from .models import Notification

CustomUser = get_user_model()

def create_system_notification(user, title, content="", type="個人通知", notify_status="待傳送", method="APP"):
    ycappsystem = CustomUser.objects.get(username='ycappsystem')
    Notification.objects.create(
        title=title,
        content=content,
        type=type,
        notify_status=notify_status,
        method=method,
        created_by=ycappsystem,
        users=user
    )