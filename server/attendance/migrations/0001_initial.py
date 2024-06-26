# Generated by Django 5.0.4 on 2024-05-18 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('attend_status', models.CharField(blank=True, choices=[('signed_in', '簽到'), ('signed_in_late', '補簽'), ('admin_signed_in_late', '管理者補簽'), ('not_verified', '未通過驗證'), ('not_signed_in', '未簽到')], max_length=20, null=True, verbose_name='簽到狀態')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='建立時間')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新時間')),
                ('check_code', models.CharField(blank=True, max_length=255, null=True, verbose_name='驗證碼')),
                ('check_note', models.TextField(blank=True, null=True, verbose_name='驗證備註')),
            ],
            options={
                'verbose_name': '課程簽到紀錄',
                'verbose_name_plural': '課程簽到紀錄',
                'db_table': 'attendance',
            },
        ),
        migrations.CreateModel(
            name='LifeguardAttendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('attend_status', models.CharField(blank=True, choices=[('signed_in', '簽到'), ('signed_in_late', '補簽'), ('admin_signed_in_late', '管理者補簽'), ('not_signed_in', '未簽到'), ('signed_out', '簽退'), ('signed_out_late', '補簽退'), ('admin_signed_out_late', '管理者補簽退'), ('not_signed_out', '未簽退'), ('not_verified', '未通過驗證')], max_length=50, null=True, verbose_name='簽到狀態')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='建立時間')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新時間')),
                ('latitude', models.FloatField(blank=True, default=0.0, null=True, verbose_name='緯度')),
                ('longitude', models.FloatField(blank=True, default=0.0, null=True, verbose_name='經度')),
                ('check_note', models.TextField(blank=True, null=True, verbose_name='驗證備註')),
            ],
            options={
                'verbose_name': '救生員出勤紀錄',
                'verbose_name_plural': '救生員出勤紀錄',
                'db_table': 'lifeguard_attendance',
            },
        ),
        migrations.CreateModel(
            name='StaffAttendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('attend_status', models.CharField(blank=True, choices=[('signed_in', '簽到'), ('signed_in_late', '補簽'), ('admin_signed_in_late', '管理者補簽'), ('not_signed_in', '未簽到'), ('signed_out', '簽退'), ('signed_out_late', '補簽退'), ('admin_signed_out_late', '管理者補簽退'), ('not_signed_out', '未簽退'), ('not_verified', '未通過驗證')], max_length=50, null=True, verbose_name='簽到狀態')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='建立時間')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新時間')),
                ('latitude', models.FloatField(blank=True, default=0.0, null=True, verbose_name='緯度')),
                ('longitude', models.FloatField(blank=True, default=0.0, null=True, verbose_name='經度')),
                ('check_note', models.TextField(blank=True, null=True, verbose_name='驗證備註')),
            ],
            options={
                'verbose_name': '員工出勤紀錄',
                'verbose_name_plural': '員工出勤紀錄',
                'db_table': 'staff_attendance',
            },
        ),
    ]
