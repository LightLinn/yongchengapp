from django.shortcuts import render
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
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser, ScreenPermissions
from humanresources.models import Coach, Lifeguard, Employee, VenueManager
from .serializers import UserSerializer, UserCreateSerializer, GroupSerializer, PermissionSerializer, PasswordResetSerializer, PasswordChangeSerializer, PasswordResetConfirmSerializer, ScreenPermissionsSerializer
from authentication.permissions import *
import qrcode
import random
from datetime import date

User = get_user_model()

# Create your views here.

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
        permissions = group.permissions.all()
        permission_data = [{'id': perm.id, 'name': perm.name, 'codename': perm.codename} for perm in permissions]
        return Response(permission_data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def add_permission(self, request, pk=None):
        group = self.get_object()
        codename = request.data.get('codename')
        try:
            permission = Permission.objects.get(codename=codename)
            group.permissions.add(permission)
            return Response({'status': 'permission added'}, status=status.HTTP_200_OK)
        except Permission.DoesNotExist:
            return Response({'status': 'permission not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def remove_permission(self, request, pk=None):
        group = self.get_object()
        codename = request.data.get('codename')
        try:
            permission = Permission.objects.get(codename=codename)
            group.permissions.remove(permission)
            return Response({'status': 'permission removed'}, status=status.HTTP_200_OK)
        except Permission.DoesNotExist:
            return Response({'status': 'permission not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def set_permissions(self, request, pk=None):
        group = self.get_object()
        codenames = request.data.get('codenames', [])
        try:
            permissions = Permission.objects.filter(codename__in=codenames)
            group.permissions.set(permissions)
            return Response({'status': 'permissions updated'}, status=status.HTTP_200_OK)
        except Permission.DoesNotExist:
            return Response({'status': 'some permissions not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
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

    @action(detail=True, methods=['post'])
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
        if group_ids:
            group_ids_list = group_ids.split(',')
            queryset = queryset.filter(group__id__in=group_ids_list)
        return queryset
    
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
            users = User.objects.filter(username__icontains=query)[:10]
            suggestions = [{'username': user.username} for user in users]
            return Response(suggestions)
        return Response([])
    
    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return response
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 添加自定义声明
        token['username'] = user.username
        token['groups'] = [group.name for group in user.groups.all()]

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # 添加用户相关信息到返回数据中
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['groups'] = [group.name for group in self.user.groups.all()]
        data['group_ids'] = [group.id for group in self.user.groups.all()]
        
        return data
    
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

# 創建QR碼
def create_qr_code(request):
    # 生成一個四位數的隨機碼
    random_code = random.randint(1000, 9999)
    # 獲取當天日期
    today = date.today().isoformat()
    # 獲取用戶ID
    user_id = request.user.id
    # 獲取用戶所在地點
    location = request.user.location

    # 生成驗證碼
    verification_code = f"{user_id}-{today}-{location}-{random_code}"

    # 將驗證碼轉換為QR碼
    #img = qrcode.make(verification_code)

    # 儲存QR碼為圖片
    #img.save("verification_code.png")

    return JsonResponse({"verification_code": verification_code})