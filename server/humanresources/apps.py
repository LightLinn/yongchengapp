from django.apps import AppConfig


class HumanresourcesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'humanresources'
    verbose_name = '人資管理'

    # def ready(self):
    #     import humanresources.signals
