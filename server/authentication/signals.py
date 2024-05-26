# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.contrib.auth.models import Group
# from .models import CustomUser

# @receiver(post_save, sender=CustomUser)
# def add_user_to_group(sender, instance, created, **kwargs):
#     if created:
#         group, _ = Group.objects.get_or_create(name='所有使用者')
#         group.user_set.add(instance)