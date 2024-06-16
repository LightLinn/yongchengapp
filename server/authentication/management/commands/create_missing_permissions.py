from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from authentication.models import Screen, ScreenPermissions

class Command(BaseCommand):
    help = 'Create missing screen permissions for existing groups'

    def handle(self, *args, **options):
        screens = Screen.objects.all()
        groups = Group.objects.all()

        for group in groups:
            for screen in screens:
                # 如果該組沒有這個屏幕的權限，則創建
                if not ScreenPermissions.objects.filter(group=group, screen_name=screen).exists():
                    ScreenPermissions.objects.create(group=group, screen_name=screen, can_view=False, can_create=False, can_edit=False, can_delete=False)
                    self.stdout.write(self.style.SUCCESS(
                        f'Created permission for group {group.name} and screen {screen.screen_name}'
                    ))

        self.stdout.write(self.style.SUCCESS('Successfully created missing permissions for all groups.'))
