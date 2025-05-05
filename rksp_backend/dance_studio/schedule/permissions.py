from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Разрешение, которое позволяет доступ только владельцу объекта или администратору.
    """
    def has_object_permission(self, request, view, obj):
        # Разрешаем доступ администраторам
        if request.user and request.user.is_staff:
            return True
        # Разрешаем доступ владельцу объекта
        return obj == request.user
