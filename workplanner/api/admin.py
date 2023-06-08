from django.contrib import admin

# Register your models here.
from .models import Customer, History, UserProfile

admin.site.register(Customer)
admin.site.register(History)
admin.site.register(UserProfile)