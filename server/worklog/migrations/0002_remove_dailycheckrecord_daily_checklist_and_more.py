# Generated by Django 5.0.4 on 2024-05-26 13:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worklog', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dailycheckrecord',
            name='daily_checklist',
        ),
        migrations.RemoveField(
            model_name='periodiccheckrecord',
            name='daily_checklist',
        ),
        migrations.RemoveField(
            model_name='specialcheckrecord',
            name='daily_checklist',
        ),
        migrations.AddField(
            model_name='dailycheckrecord',
            name='check_item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='worklog.dailychecklist', verbose_name='每日檢點'),
        ),
        migrations.AddField(
            model_name='periodiccheckrecord',
            name='check_item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='worklog.periodicchecklist', verbose_name='定時檢點'),
        ),
        migrations.AddField(
            model_name='specialcheckrecord',
            name='check_item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='worklog.specialchecklist', verbose_name='特殊處理檢點'),
        ),
    ]