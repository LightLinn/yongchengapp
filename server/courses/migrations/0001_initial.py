# Generated by Django 5.0.4 on 2024-05-18 10:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('humanresources', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('course_date', models.DateField(blank=True, null=True, verbose_name='課程日期')),
                ('course_time', models.DateTimeField(blank=True, null=True, verbose_name='課程時間')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='建立時間')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新時間')),
                ('course_status', models.CharField(blank=True, choices=[('not_started', '未開課'), ('in_progress', '進行中'), ('cancelled', '已取消'), ('completed', '已完成'), ('suspended', '已停課')], max_length=20, null=True, verbose_name='課程狀態')),
            ],
            options={
                'verbose_name': '課程',
                'verbose_name_plural': '課程',
                'db_table': 'course',
            },
        ),
        migrations.CreateModel(
            name='CourseType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('name', models.CharField(max_length=255, verbose_name='課程類型名稱')),
                ('description', models.TextField(verbose_name='課程類型描述')),
                ('price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='價格')),
                ('capacity', models.IntegerField(blank=True, null=True, verbose_name='容量')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='建立時間')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新時間')),
                ('number_of_sessions', models.IntegerField(blank=True, null=True, verbose_name='每期堂數')),
            ],
            options={
                'verbose_name': '課程類型',
                'verbose_name_plural': '課程類型',
                'db_table': 'course_type',
            },
        ),
        migrations.CreateModel(
            name='AssignedCourse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('assigned_status', models.CharField(choices=[('pending', '待決定'), ('accepted', '已接受'), ('rejected', '已拒絕')], default='pending', max_length=20, verbose_name='狀態')),
                ('assigned_time', models.DateTimeField(blank=True, null=True, verbose_name='指派時間')),
                ('deadline', models.DateTimeField(blank=True, null=True, verbose_name='截止時間')),
                ('decide_hours', models.IntegerField(blank=True, default=24, null=True, verbose_name='決定時間(小時)')),
                ('rank', models.IntegerField(blank=True, null=True, verbose_name='順位')),
                ('remark', models.TextField(blank=True, null=True, verbose_name='備註')),
                ('coach', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assigned_courses', to='humanresources.coach', verbose_name='教練')),
            ],
            options={
                'verbose_name': '指派課程',
                'verbose_name_plural': '指派課程',
                'db_table': 'assigned_course',
            },
        ),
        migrations.CreateModel(
            name='EnrollmentList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('enrollment_status', models.CharField(blank=True, choices=[('pending_payment', '待付款'), ('in_progress', '審核中'), ('in_assigned', '派課中'), ('assigned', '已派課'), ('not_assigned', '未派課'), ('not_accepted', '未接受'), ('completed', '已完成'), ('cancelled', '已取消'), ('refunded', '已退款')], max_length=20, null=True, verbose_name='報名狀態')),
                ('student', models.CharField(max_length=255, verbose_name='學生姓名')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='建立時間')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新時間')),
                ('start_date', models.DateField(blank=True, null=True, verbose_name='開始日期')),
                ('start_time', models.DateTimeField(blank=True, null=True, verbose_name='開始時間')),
                ('payment_date', models.DateField(blank=True, null=True, verbose_name='付款日期')),
                ('payment_method', models.CharField(blank=True, choices=[('cash', '現金')], default='cash', max_length=20, null=True, verbose_name='付款方式')),
                ('payment_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='付款金額')),
                ('remark', models.TextField(blank=True, null=True, verbose_name='備註')),
                ('degree', models.CharField(blank=True, max_length=255, null=True, verbose_name='程度描述')),
                ('coursetype', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='courses.coursetype', verbose_name='課程類型')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': '報名',
                'verbose_name_plural': '報名',
                'db_table': 'enrollment',
            },
        ),
        migrations.CreateModel(
            name='EnrollmentNumbers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('name', models.CharField(max_length=255, verbose_name='報名單編號')),
                ('description', models.TextField(verbose_name='組別描述')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='建立時間')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新時間')),
                ('number_of_sessions', models.IntegerField(blank=True, default=10, null=True, verbose_name='課堂數量')),
                ('coach', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='humanresources.coach', verbose_name='教練')),
            ],
            options={
                'verbose_name': '報名單編號',
                'verbose_name_plural': '報名單編號',
                'db_table': 'enrollment_number',
            },
        ),
    ]
