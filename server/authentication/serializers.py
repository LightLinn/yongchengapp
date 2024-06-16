from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, ScreenPermissions, Screen
from datetime import datetime


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'  # 或者使用 'id' 如果前端需要群組ID
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'sex', 'birthday', 'address', 'avatar', 'groups', 'nickname']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

class ScreenSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Screen
        fields = ['id', 'screen_name']

class ScreenPermissionsSerializer(serializers.ModelSerializer):
    screen_name = ScreenSerializer()
    
    class Meta:
        model = ScreenPermissions
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    users = UserSerializer(source='user_set', many=True, read_only=True)
    permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'users', 'permissions']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        username = validated_data.get('username')
        email = validated_data.get('email')
        
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError('使用者名稱已被存在')
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('電子信箱已被註冊')
        
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()

    def validate(self, data):
        try:
            user = CustomUser.objects.get(username=data['username'], email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("使用者名稱或電子郵件的使用者不存在")
        return data
    
class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, required=True)

    def validate_new_password(self, value):
        # 你可以在这里添加密码验证规则
        if len(value) <= 8:
            raise serializers.ValidationError("密碼必須是英數組合且8位數以上")
        return value

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("舊密碼不正確")
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value


# 列出所有權限及其對應的 codenames
# from django.contrib.auth.models import Permission

# permissions = Permission.objects.all()
# for perm in permissions:
#     print(f"Name: {perm.name}, Codename: {perm.codename}")
