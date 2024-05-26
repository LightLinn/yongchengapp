from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.contrib.auth.models import Group, User
from .models import Employee, Coach, Lifeguard, VenueManager
from authentication.models import CustomUser
from django.db.models.signals import post_save, post_delete

@receiver(m2m_changed, sender=CustomUser.groups.through)
def update_user_groups(sender, instance, action, **kwargs):
    # 定義群組和模型的對應關係
    group_model_mapping = {
        '內部_教練': Coach,
        '內部_救生員': Lifeguard,
        '內部_行政人員': Employee,
        '外部_場地管理人員': VenueManager,
    }

    # 獲取所有的群組
    groups = Group.objects.filter(name__in=group_model_mapping.keys())

    for group in groups:
        model = group_model_mapping[group.name]

        if action == 'post_add':
            if group in instance.groups.all():
                model.objects.get_or_create(user=instance)
        elif action == 'post_remove':
            if group not in instance.groups.all():
                model.objects.filter(user=instance).delete()


# @receiver(post_delete, sender=CustomUser)
# def remove_user_from_group(sender, instance, **kwargs):
#     group = Group.objects.get(name='All Users')
#     if group in instance.groups.all():
#         instance.groups.remove(group)