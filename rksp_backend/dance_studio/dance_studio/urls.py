from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('schedule/', include('schedule.urls')),
    path('auth/', include('djoser.urls.jwt')),
]
