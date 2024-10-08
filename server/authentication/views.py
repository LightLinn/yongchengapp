from django.shortcuts import render
from django.db.models import Q
from django.http import JsonResponse
from django.contrib.auth.models import Group, Permission
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import ValidationError
from .serializers import MyTokenObtainPairSerializer

from .models import CustomUser, ScreenPermissions, Screen
from humanresources.models import Coach, Lifeguard, Employee, VenueManager
from .serializers import UserSerializer, UserCreateSerializer, GroupSerializer, PermissionSerializer, PasswordResetSerializer, PasswordChangeSerializer, PasswordResetConfirmSerializer, ScreenPermissionsSerializer, ScreenSerializer
from authentication.permissions import *
import qrcode
import random
from datetime import date
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

# Create your views here.

class CheckTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"valid": True})

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAuthenticated]

    group_model_mapping = {
        '內部_教練': Coach,
        '內部_救生員': Lifeguard,
        '內部_行政人員': Employee,
        '外部_場地管理人員': VenueManager,
    }

    def get_queryset(self):
        queryset = super().get_queryset()
        group_name = self.request.query_params.get('group_name')
        
        if group_name:
            queryset = queryset.filter(name=group_name)
        return queryset
    
    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        group = self.get_object()
        users = group.user_set.all()
        user_data = [{"id": user.id, "username": user.username} for user in users]
        return Response(user_data)
    
    @action(detail=True, methods=['get'])
    def permissions(self, request, pk=None):
        group = self.get_object()
        permissions = ScreenPermissions.objects.filter(group=group)
        serializer = ScreenPermissionsSerializer(permissions, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        group = serializer.save()
        screens = Screen.objects.all()
        for screen in screens:
            ScreenPermissions.objects.create(group=group, screen_name=screen)

    # @action(detail=True, methods=['post'])
    # def add_permission(self, request, pk=None):
    #     group = self.get_object()
    #     codename = request.data.get('codename')
    #     try:
    #         permission = Permission.objects.get(codename=codename)
    #         group.permissions.add(permission)
    #         return Response({'status': 'permission added'}, status=status.HTTP_200_OK)
    #     except Permission.DoesNotExist:
    #         return Response({'status': 'permission not found'}, status=status.HTTP_404_NOT_FOUND)

    # @action(detail=True, methods=['post'])
    # def remove_permission(self, request, pk=None):
    #     group = self.get_object()
    #     codename = request.data.get('codename')
    #     try:
    #         permission = Permission.objects.get(codename=codename)
    #         group.permissions.remove(permission)
    #         return Response({'status': 'permission removed'}, status=status.HTTP_200_OK)
    #     except Permission.DoesNotExist:
    #         return Response({'status': 'permission not found'}, status=status.HTTP_404_NOT_FOUND)

    # @action(detail=True, methods=['post'])
    # def set_permissions(self, request, pk=None):
    #     group = self.get_object()
    #     codenames = request.data.get('codenames', [])
    #     try:
    #         permissions = Permission.objects.filter(codename__in=codenames)
    #         group.permissions.set(permissions)
    #         return Response({'status': 'permissions updated'}, status=status.HTTP_200_OK)
    #     except Permission.DoesNotExist:
    #         return Response({'status': 'some permissions not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def add_user(self, request, pk=None):
        group = self.get_object()
        username = request.data.get('username')
        try:
            user = CustomUser.objects.get(username=username)
            group.user_set.add(user)

            # 更新相應的模型
            model = self.group_model_mapping.get(group.name)
            if model:
                model.objects.get_or_create(user=user)

            return Response({'status': 'user added'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'status': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def remove_user(self, request, pk=None):
        group = self.get_object()
        username = request.data.get('username')
        try:
            user = CustomUser.objects.get(username=username)
            group.user_set.remove(user)

            # 更新相應的模型
            model = self.group_model_mapping.get(group.name)
            if model:
                model.objects.filter(user=user).delete()

            return Response({'status': 'user removed'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'status': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # 前端/groups/?user=${userId}，取得特定使用者所在的群組
    @action(detail=False, methods=['get'])
    def user_groups(self, request):
        user_id = request.query_params.get('user')
        user = get_object_or_404(CustomUser, id=user_id)
        groups = user.groups.all()
        group_data = [{'id': group.id, 'name': group.name} for group in groups]
        return Response(group_data, status=status.HTTP_200_OK)


class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    # permission_classes = [permissions.IsAuthenticated]

class ScreenPermissionsViewSet(viewsets.ModelViewSet):
    queryset = ScreenPermissions.objects.all()
    serializer_class = ScreenPermissionsSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
    #透過get方法，取得特定群組的權限
    def get_queryset(self):
        queryset = super().get_queryset()
        group_ids = self.request.query_params.get('group_ids')
        pk = self.kwargs.get('pk')

        if pk:  # 如果有指定ID，則過濾該ID
            queryset = queryset.filter(pk=pk)
        elif group_ids:  # 否則根據group_ids過濾
            group_ids_list = group_ids.split(',')
            queryset = queryset.filter(group__id__in=group_ids_list)
        else:
            queryset = queryset.none()
        return queryset

class ScreenViewSet(viewsets.ModelViewSet):
    queryset = Screen.objects.all()
    serializer_class = ScreenSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        group_id = self.request.query_params.get('group_id')
        if group_id:
            queryset = queryset.filter(groups__id=group_id)
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def suggestions(self, request):
        query = request.query_params.get('q', '')
        if query:
            users = User.objects.filter(
                Q(username__icontains=query) | 
                Q(nickname__icontains=query) | 
                Q(fullname__icontains=query)
            )[:10]
            suggestions = [{'username': user.username, 'nickname': user.nickname, 'fullname': user.fullname} for user in users]
            print(suggestions)
            return Response(suggestions)
        return Response([])
    
    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return response
    
    @action(detail=True, methods=['delete'], url_path='delete_account')
    def delete_account(self, request, pk=None):
        try:
            user = self.get_object()
            user.delete()
            return Response({'detail': '帳號已成功刪除'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'detail': '找不到用戶'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': f'刪除帳號失敗: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class PasswordResetView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(username=username, email=email)
            except User.DoesNotExist:
                return Response({"detail": "未找到使用者"}, status=status.HTTP_400_BAD_REQUEST)

            # 生成密码重置链接
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            return Response({
                "detail": "已发送密码重设请求",
                "uid": uid,
                "token": token
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            serializer = PasswordResetConfirmSerializer(data=request.data)
            if serializer.is_valid():
                new_password = serializer.validated_data['new_password']
                user.set_password(new_password)
                user.save()
                return Response({"detail": "密码已重设"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "无效的链接"}, status=status.HTTP_400_BAD_REQUEST)

class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # 处理修改密码的逻辑
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({"detail": "Password changed successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
