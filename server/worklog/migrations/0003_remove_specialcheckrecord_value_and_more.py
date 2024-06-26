# Generated by Django 5.0.4 on 2024-05-26 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worklog', '0002_remove_dailycheckrecord_daily_checklist_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='specialcheckrecord',
            name='value',
        ),
        migrations.AddField(
            model_name='periodiccheckrecord',
            name='pool',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='池號'),
        ),
        migrations.AddField(
            model_name='specialcheckrecord',
            name='end_time',
            field=models.DateTimeField(blank=True, null=True, verbose_name='結束時間'),
        ),
        migrations.AddField(
            model_name='specialcheckrecord',
            name='start_time',
            field=models.DateTimeField(blank=True, null=True, verbose_name='開始時間'),
        ),
    ]
