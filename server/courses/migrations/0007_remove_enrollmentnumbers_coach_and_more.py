# Generated by Django 5.0.4 on 2024-05-26 14:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0006_alter_enrollmentlist_enrollment_status'),
        ('humanresources', '0002_alter_coach_options_alter_employee_options_and_more'),
        ('venues', '0004_alter_venue_managers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='enrollmentnumbers',
            name='coach',
        ),
        migrations.RemoveField(
            model_name='enrollmentnumbers',
            name='venue',
        ),
        migrations.AddField(
            model_name='enrollmentlist',
            name='coach',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='humanresources.coach', verbose_name='教練'),
        ),
        migrations.AddField(
            model_name='enrollmentlist',
            name='venue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='venues.venue', verbose_name='場地'),
        ),
        migrations.AddField(
            model_name='enrollmentnumbers',
            name='enrollments',
            field=models.ManyToManyField(blank=True, null=True, related_name='enrollment_numbers', to='courses.enrollmentlist', verbose_name='報名單編號'),
        ),
        migrations.AlterField(
            model_name='enrollmentlist',
            name='enrollment_number',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='enrollment_lists', to='courses.enrollmentnumbers', verbose_name='報名單編號'),
        ),
    ]
