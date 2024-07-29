# Generated by Django 5.0.4 on 2024-07-28 03:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('humanresources', '0006_alter_coach_status_alter_employee_status_and_more'),
        ('schedule', '0009_alter_lifeguardschedule_status_alter_location_status_and_more'),
        ('venues', '0011_alter_venue_status_alter_venuebooking_status_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='lifeguardschedule',
            name='schedule_status',
            field=models.CharField(blank=True, choices=[('待執勤', '待執勤'), ('執勤中', '執勤中'), ('已執勤', '已執勤'), ('未執勤', '未執勤')], default='待執勤', max_length=20, null=True, verbose_name='班表狀態'),
        ),
        migrations.AlterField(
            model_name='lifeguardschedule',
            name='lifeguard',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lifeguard_schedules', to='humanresources.lifeguard', verbose_name='救生員'),
        ),
        migrations.AlterField(
            model_name='lifeguardschedule',
            name='venue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lifeguard_schedules', to='venues.venue', verbose_name='地點'),
        ),
    ]
