# Generated by Django 5.0.4 on 2024-06-07 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0014_course_enrollment_list_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='course_time',
            field=models.TimeField(blank=True, null=True, verbose_name='課程時間'),
        ),
    ]