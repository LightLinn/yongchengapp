# Generated by Django 5.0.4 on 2024-06-19 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0025_remove_enrollmentnumbers_enrollments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='enrollmentnumbers',
            name='name',
            field=models.CharField(max_length=255, unique=True, verbose_name='報名單編號'),
        ),
    ]
