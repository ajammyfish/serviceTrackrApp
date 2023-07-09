from django.contrib import admin

# Register your models here.
from .models import Customer, History, UserProfile, Expenses

admin.site.register(Customer)
admin.site.register(History)
admin.site.register(UserProfile)
admin.site.register(Expenses)