# Generated by Django 5.0.4 on 2024-06-06 12:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worklog', '0006_alter_dailycheckrecord_status_alter_worklog_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dailycheckrecord',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='worklog',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='審核狀態'),
        ),
    ]
