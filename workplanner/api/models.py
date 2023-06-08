from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Customer(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    price = models.IntegerField()
    due_date = models.DateField()
    is_deleted = models.BooleanField(default=False)
    name = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    temp_notes = models.TextField(blank=True, null=True)
    schedule = models.PositiveIntegerField(default=0)
    in_worksheet = models.BooleanField(default=False)
    worksheet_date = models.DateField(null=True, blank=True)

class History(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    date = models.DateField()
    payment_amount = models.IntegerField()
    payment_method = models.TextField()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_account_setup = models.BooleanField(default=False)
    business_type = models.CharField(max_length=100)
    business_name = models.CharField(max_length=100)
    round_schedule = models.PositiveIntegerField(null=True, blank=True)