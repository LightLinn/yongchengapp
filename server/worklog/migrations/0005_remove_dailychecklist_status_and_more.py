# Generated by Django 5.0.4 on 2024-06-01 23:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('worklog', '0004_worklog_is_final'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dailychecklist',
            name='status',
        ),
        migrations.RemoveField(
            model_name='periodicchecklist',
            name='status',
        ),
        migrations.RemoveField(
            model_name='periodiccheckrecord',
            name='status',
        ),
        migrations.RemoveField(
            model_name='specialcheckrecord',
            name='status',
        ),
    ]