

from django.core.management.base import BaseCommand
from worklog.models import DailyChecklist

class Command(BaseCommand):
    help = 'Create initial checklist items'

    def handle(self, *args, **kwargs):
        checklist_items = [
            "泳池機房設備運轉是否有異音",
            "過濾系統壓力檢視且送電正常",
            "機房管路是否有漏水現象",
            "確認熱泵及溫控裝置是否運轉正常，大池 28℃ / 小池 35℃",
            "檢視自動控制系統是否正常",
            "確認蒸氣、烤箱、SPA設備正常與否",
            "檢視池底、池中、池面狀態",
            "泳池館設備是否正常 (排氣、吹風機及蓮蓬頭等)",
            "監測水質狀況是否正常與否",
            "是否已群組回報泳池、SPA池水溫",
            "男、女更衣室大門及置物櫃於下班時開啟通風",
            "確認每日特別清潔項目皆已完成",
            "電燈、天花、門窗、設備無異常狀況",
        ]

        for item in checklist_items:
            DailyChecklist.objects.get_or_create(item=item)
        
        self.stdout.write(self.style.SUCCESS('Successfully created checklist items'))
