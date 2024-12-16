from django.contrib import admin


# admin.site.register(User)

from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'profile_picture')
    search_fields = ('user__username', 'user__email')