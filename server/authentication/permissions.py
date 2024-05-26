from rest_framework import permissions

# 創建驗證使用者是否為指定群組內的成員，群組有內部_行政人員、內部_教練、內部_學生、內部_管理人員、外部_場地管理人員

class IsStaffGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='內部_行政人員').exists()

class IsCoachGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='內部_教練').exists()
    
class IsLifeguardGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='內部_救生員').exists()

class IsStudentGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='內部_學生').exists()
    
class IsManagerGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='內部_管理人員').exists()
    
class IsExternalManagerGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='外部_場地管理人員').exists()
    
class IsAdministratorGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='administrator').exists()


'''
在 Django REST Framework 中，您可以使用權限類（Permission Classes）來控制基於群組的訪問權限。您已經有一個 IsCoachGroup 的權限類，它允許屬於 '內部_教練' 群組的用戶訪問某些視圖。

要在視圖中使用這個權限類，您可以將其添加到視圖的 permission_classes 屬性中。例如：

from rest_framework import viewsets
from .permissions import IsCoachGroup

class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsCoachGroup]
    # 其他視圖設置...

.
在這個例子中，只有屬於 '內部_教練' 群組的用戶才能訪問 MyViewSet 的所有操作（如 GET、POST、PUT 等）。

如果您想要根據不同的操作來改變權限，您可以覆寫視圖的 get_permissions 方法。例如，只允許 '內部_教練' 群組的用戶進行 POST 操作：

from rest_framework import viewsets, permissions
from .permissions import IsCoachGroup

class MyViewSet(viewsets.ModelViewSet):
    # 其他視圖設置...

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsCoachGroup()]
        return [permissions.AllowAny()]

在這個例子中，只有屬於 '內部_教練' 群組的用戶才能進行 POST 操作，其他用戶可以進行所有其他操作。
'''

'''
如果你希望在新增群組時不需要修改代碼，你可以創建一個更通用的權限類，它接受群組名作為參數。以下是一個基本的實現：
class IsInGroup(permissions.BasePermission):
    def __init__(self, group_name):
        self.group_name = group_name

    def has_permission(self, request, view):
        return request.user.groups.filter(name=self.group_name).exists()

然後，你可以在你的視圖中使用這個權限類，並提供群組名作為參數：
class SomeView(APIView):
    permission_classes = [IsInGroup('內部_行政人員')]

    # ... view logic ...

這樣，每當你在 Django Admin 中新增一個群組，你只需要在相應的視圖中使用 IsInGroup 權限類，並提供新的群組名作為參數，而不需要修改 IsInGroup 類本身。
'''

'''
在 Django REST Framework 中，你可以使用 get_permissions 方法來獲取一個視圖集（Viewset）的所有權限。然後，你可以使用 has_permission 方法來檢查一個群組是否有這些權限。
from django.contrib.auth.models import Group
from rest_framework import viewsets

class SomeViewset(viewsets.ModelViewSet):
    # ... existing code ...

    def check_group_permissions(self, group_name):
        # Get the group
        group = Group.objects.get(name=group_name)

        # Get the permissions of the group
        group_permissions = group.permissions.all()

        # Get the permissions of the viewset
        viewset_permissions = self.get_permissions()

        # Check if the group has all the permissions of the viewset
        for permission in viewset_permissions:
            if not group_permissions.filter(codename=permission.codename).exists():
                return False

        return True

在這個例子中，我們首先從資料庫中取得名為 group_name 的群組。然後，我們使用 group.permissions.all() 來取得這個群組的所有權限。接著，我們使用 self.get_permissions() 來取得視圖集的所有權限。最後，我們遍歷視圖集的所有權限，並檢查群組是否有這些權限。

請注意，這只是一個基本的實現，並且可能需要根據你的具體需求進行調整。
'''