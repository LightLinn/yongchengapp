# Generated by Django 5.0.4 on 2024-05-26 14:17

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0003_alter_venue_description'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='venue',
            name='managers',
            field=models.ManyToManyField(related_name='venues', to=settings.AUTH_USER_MODEL, verbose_name='場地管理者'),
        ),
    ]