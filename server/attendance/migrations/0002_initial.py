# Generated by Django 5.0.4 on 2024-05-18 10:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('attendance', '0001_initial'),
        ('courses', '0002_initial'),
        ('schedule', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='attendance',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attendances', to='courses.course', verbose_name='課程'),
        ),
        migrations.AddField(
            model_name='attendance',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attendances', to=settings.AUTH_USER_MODEL, verbose_name='使用者'),
        ),
        migrations.AddField(
            model_name='lifeguardattendance',
            name='schedule',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lifeguard_attendances', to='schedule.lifeguardschedule', verbose_name='排班'),
        ),
        migrations.AddField(
            model_name='lifeguardattendance',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lifeguard_attendances', to=settings.AUTH_USER_MODEL, verbose_name='使用者'),
        ),
        migrations.AddField(
            model_name='staffattendance',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='staff_attendances', to=settings.AUTH_USER_MODEL, verbose_name='使用者'),
        ),
    ]
