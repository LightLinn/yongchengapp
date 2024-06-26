# Generated by Django 5.0.4 on 2024-06-29 12:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0011_alter_venue_status_alter_venuebooking_status_and_more'),
        ('worklog', '0009_alter_dailycheckrecord_status_alter_worklog_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailycheckrecord',
            name='date',
            field=models.DateField(blank=True, null=True, verbose_name='檢點日期'),
        ),
        migrations.AddField(
            model_name='dailycheckrecord',
            name='venue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='venues.venue', verbose_name='場地'),
        ),
    ]
