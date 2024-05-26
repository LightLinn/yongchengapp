from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import CustomUser

# class CustomUserAdmin(UserAdmin):
#     form = UserChangeForm
#     add_form = UserCreationForm
#     model = CustomUser
#     list_display = ['username', 'email', 'phone', 'sex', 'is_active', 'is_staff']
#     fieldsets = UserAdmin.fieldsets + (
#         (None, {'fields': ('email','phone', 'sex', 'birthday', 'address', 'avatar')}),
#     )
#     add_fieldsets = UserAdmin.add_fieldsets + (
#         (None, {'fields': ('email','phone', 'sex', 'birthday', 'address', 'avatar')}),
#     )

# admin.site.register(CustomUser, CustomUserAdmin)

class CustomUserAdmin(UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    model = CustomUser
    list_display = ['username', 'email', 'phone', 'sex', 'is_active', 'is_staff']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (('Extra info'), {'fields': ('phone', 'sex', 'birthday', 'address', 'avatar')}),
    )
    add_fieldsets = (
        (None, {'fields': ('username', 'password1', 'password2')}),
        (('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.site_header = "你的網站管理"
admin.site.site_title = "你的網站管理"
admin.site.index_title = "歡迎來到你的網站管理"


