from django.contrib import admin

# Register your models here.

from .models import UserActivity

admin.site.register(UserActivity)

# 如何更改Django管理後台的標題和頁面標題？


admin.site.site_header = "你的網站管理"
admin.site.site_title = "你的網站管理"
admin.site.index_title = "歡迎來到你的網站管理"


