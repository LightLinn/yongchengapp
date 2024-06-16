# Generated by Django 5.0.4 on 2024-06-15 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0019_alter_enrollmentlist_enrollment_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignedcourse',
            name='status',
            field=models.CharField(choices=[('待審核', '待審核'), ('審核中', '審核中'), ('已批准', '已批准'), ('已拒絕', '已拒絕'), ('需要更多信息', '需要更多信息'), ('已取消', '已取消'), ('暫停', '暫停'), ('重新審核', '重新審核'), ('自動批准', '自動批准'), ('已過期', '已過期')], default='待審核', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='course',
            name='status',
            field=models.CharField(choices=[('待審核', '待審核'), ('審核中', '審核中'), ('已批准', '已批准'), ('已拒絕', '已拒絕'), ('需要更多信息', '需要更多信息'), ('已取消', '已取消'), ('暫停', '暫停'), ('重新審核', '重新審核'), ('自動批准', '自動批准'), ('已過期', '已過期')], default='待審核', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='coursetype',
            name='status',
            field=models.CharField(choices=[('待審核', '待審核'), ('審核中', '審核中'), ('已批准', '已批准'), ('已拒絕', '已拒絕'), ('需要更多信息', '需要更多信息'), ('已取消', '已取消'), ('暫停', '暫停'), ('重新審核', '重新審核'), ('自動批准', '自動批准'), ('已過期', '已過期')], default='待審核', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='enrollmentlist',
            name='status',
            field=models.CharField(choices=[('待審核', '待審核'), ('審核中', '審核中'), ('已批准', '已批准'), ('已拒絕', '已拒絕'), ('需要更多信息', '需要更多信息'), ('已取消', '已取消'), ('暫停', '暫停'), ('重新審核', '重新審核'), ('自動批准', '自動批准'), ('已過期', '已過期')], default='待審核', max_length=20, verbose_name='審核狀態'),
        ),
        migrations.AlterField(
            model_name='enrollmentnumbers',
            name='status',
            field=models.CharField(choices=[('待審核', '待審核'), ('審核中', '審核中'), ('已批准', '已批准'), ('已拒絕', '已拒絕'), ('需要更多信息', '需要更多信息'), ('已取消', '已取消'), ('暫停', '暫停'), ('重新審核', '重新審核'), ('自動批准', '自動批准'), ('已過期', '已過期')], default='待審核', max_length=20, verbose_name='審核狀態'),
        ),
    ]
