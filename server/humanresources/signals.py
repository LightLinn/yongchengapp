from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.contrib.auth.models import Group, User
from .models import Employee, Coach, Lifeguard, VenueManager
from authentication.models import CustomUser

# @receiver(m2m_changed, sender=CustomUser.groups.through)
# def update_user_groups(sender, instance, action, pk_set, **kwargs):
#     # 定義群組和模型的對應關係
#     group_model_mapping = {
#         '內部_教練': Coach,
#         '內部_救生員': Lifeguard,
#         '內部_行政人員': Employee,
#         '外部_場地管理人員': VenueManager,
#     }

#     # 當群組被添加或移除時，執行以下邏輯
#     if action in ['post_add', 'post_remove']:
#         # 獲取用戶當前的群組
#         user_groups = instance.groups.all()

#         for group_name, model in group_model_mapping.items():
#             group = Group.objects.get(name=group_name)
#             if group in user_groups:
#                 # 群組被添加
#                 if action == 'post_add':
#                     model.objects.get_or_create(user=instance)
#                 # 群組被移除
#                 elif action == 'post_remove':
#                     if group.id in pk_set:
#                         model.objects.filter(user=instance).delete()
#             else:
#                 # 群組被移除
#                 if action == 'post_remove' and group.id in pk_set:
#                     model.objects.filter(user=instance).delete()
