# Generated by Django 5.0.8 on 2024-08-17 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0008_alter_notification_method_alter_notification_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='notify_status',
            field=models.CharField(blank=True, choices=[('待傳送', '待傳送'), ('成功', '成功'), ('失敗', '失敗'), ('取消', '取消')], max_length=20, null=True, verbose_name='訊息狀態'),
        ),
    ]
