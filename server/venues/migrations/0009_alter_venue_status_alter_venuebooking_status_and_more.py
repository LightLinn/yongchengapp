# Generated by Django 5.0.4 on 2024-06-06 12:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0008_alter_venue_status_alter_venuebooking_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='venue',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='venuebooking',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='venuebookingstatus',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='venueinspectionrecord',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='venuerepairrequest',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='venueusagerecord',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='審核狀態'),
        ),
    ]
