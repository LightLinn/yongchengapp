# Generated by Django 5.0.4 on 2024-05-26 11:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_alter_coursetype_number_of_sessions'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coursetype',
            name='capacity',
        ),
        migrations.RemoveField(
            model_name='enrollmentnumbers',
            name='description',
        ),
        migrations.RemoveField(
            model_name='enrollmentnumbers',
            name='number_of_sessions',
        ),
    ]
