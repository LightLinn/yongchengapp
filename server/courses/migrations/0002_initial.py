# Generated by Django 5.0.4 on 2024-05-18 10:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '0001_initial'),
        ('venues', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='enrollmentnumbers',
            name='venue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='venues.venue', verbose_name='場地'),
        ),
        migrations.AddField(
            model_name='enrollmentlist',
            name='enrollment_number',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='enrollments', to='courses.enrollmentnumbers', verbose_name='報名單編號'),
        ),
        migrations.AddField(
            model_name='course',
            name='enrollment_number',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='courses', to='courses.enrollmentnumbers', verbose_name='報名表單號'),
        ),
        migrations.AddField(
            model_name='assignedcourse',
            name='enrollment_number',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_courses', to='courses.enrollmentnumbers', verbose_name='報名單編號'),
        ),
    ]
