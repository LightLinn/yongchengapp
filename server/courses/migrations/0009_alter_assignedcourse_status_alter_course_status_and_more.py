# Generated by Django 5.0.4 on 2024-06-06 11:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0008_alter_enrollmentnumbers_enrollments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignedcourse',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='ㄕㄣ狀態'),
        ),
        migrations.AlterField(
            model_name='course',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='ㄕㄣ狀態'),
        ),
        migrations.AlterField(
            model_name='coursetype',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='ㄕㄣ狀態'),
        ),
        migrations.AlterField(
            model_name='enrollmentlist',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='ㄕㄣ狀態'),
        ),
        migrations.AlterField(
            model_name='enrollmentnumbers',
            name='status',
            field=models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20, verbose_name='ㄕㄣ狀態'),
        ),
    ]