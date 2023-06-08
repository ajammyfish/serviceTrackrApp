from rest_framework import serializers
from .models import Customer, History, User, UserProfile
from django.contrib.auth import authenticate
from rest_framework.serializers import ModelSerializer

class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email address already exists.')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username address already exists.')
        return value

    def create(self, validated_data):
        # Create a new user object and save it to the database
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            is_active=False
        )
        UserProfile.objects.create(user=user)
        return user

class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class HistorySerializer(ModelSerializer):
    customer = CustomerSerializer()
    class Meta:
        model = History
        fields = '__all__'


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('business_type', 'business_name', 'round_schedule', 'is_account_setup')