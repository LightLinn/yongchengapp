# Generated by Django 5.0.4 on 2024-05-18 10:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('schedule', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyChecklist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('item', models.CharField(max_length=100, verbose_name='項目')),
                ('description', models.TextField(blank=True, null=True, verbose_name='描述')),
            ],
            options={
                'verbose_name': '每日檢點',
                'verbose_name_plural': '每日檢點',
                'db_table': 'daily_checklist',
            },
        ),
        migrations.CreateModel(
            name='PeriodicChecklist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('item', models.CharField(max_length=100, verbose_name='項目')),
                ('description', models.TextField(blank=True, null=True, verbose_name='描述')),
            ],
            options={
                'verbose_name': '定時檢點',
                'verbose_name_plural': '定時檢點',
                'db_table': 'periodic_checklist',
            },
        ),
        migrations.CreateModel(
            name='SpecialChecklist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item', models.CharField(max_length=100, verbose_name='項目')),
                ('description', models.TextField(blank=True, null=True, verbose_name='描述')),
            ],
            options={
                'verbose_name': '特殊處理檢點',
                'verbose_name_plural': '特殊處理檢點',
                'db_table': 'special_checklist',
            },
        ),
        migrations.CreateModel(
            name='DailyCheckRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('score', models.IntegerField(choices=[(0, '優'), (1, '尚可'), (2, '需改善')], default=0)),
                ('remark', models.TextField(blank=True, null=True, verbose_name='備註')),
                ('daily_checklist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='worklog.dailychecklist', verbose_name='每日檢點')),
                ('duty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='schedule.lifeguardschedule', verbose_name='值班人員')),
            ],
            options={
                'verbose_name': '每日檢點記錄',
                'verbose_name_plural': '每日檢點記錄',
                'db_table': 'daily_check_record',
            },
        ),
        migrations.CreateModel(
            name='PeriodicCheckRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('value', models.FloatField(verbose_name='數值')),
                ('remark', models.TextField(blank=True, null=True, verbose_name='備註')),
                ('daily_checklist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='worklog.dailychecklist', verbose_name='定時檢點')),
                ('duty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='schedule.lifeguardschedule', verbose_name='值班人員')),
            ],
            options={
                'verbose_name': '定時檢點記錄',
                'verbose_name_plural': '定時檢點記錄',
                'db_table': 'periodic_check_record',
            },
        ),
        migrations.CreateModel(
            name='SpecialCheckRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('quantity', models.FloatField(verbose_name='數量')),
                ('value', models.FloatField(verbose_name='數值')),
                ('remark', models.TextField(blank=True, null=True, verbose_name='備註')),
                ('daily_checklist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='worklog.dailychecklist', verbose_name='特殊處理檢點')),
                ('duty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='schedule.lifeguardschedule', verbose_name='值班人員')),
            ],
            options={
                'verbose_name': '特殊處理檢點記錄',
                'verbose_name_plural': '特殊處理檢點記錄',
                'db_table': 'special_check_record',
            },
        ),
        migrations.CreateModel(
            name='Worklog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '待審核'), ('reviewing', '審核中'), ('approved', '已批准'), ('rejected', '已拒絕'), ('requires_more_info', '需要更多信息'), ('cancelled', '已取消'), ('on_hold', '暫停'), ('re_review', '重新審核'), ('auto_approved', '自動批准'), ('expired', '已過期')], default='pending', max_length=20)),
                ('title', models.CharField(max_length=100)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('usage_count', models.PositiveIntegerField(default=0, verbose_name='使用人數')),
                ('daily_checks', models.ManyToManyField(blank=True, to='worklog.dailycheckrecord')),
                ('duty', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='schedule.lifeguardschedule', verbose_name='值班人員')),
                ('periodic_checks', models.ManyToManyField(blank=True, to='worklog.periodiccheckrecord')),
                ('special_checks', models.ManyToManyField(blank=True, to='worklog.specialcheckrecord')),
            ],
            options={
                'verbose_name': '工作日誌',
                'verbose_name_plural': '工作日誌',
                'db_table': 'worklog',
                'ordering': ['-created_at'],
            },
        ),
    ]