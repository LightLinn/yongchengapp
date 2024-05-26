from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'
    verbose_name = '驗證管理'

    def ready(self):
        import authentication.signals  # noqa



    