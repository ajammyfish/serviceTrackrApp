from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', views.user_login, name="login"),
    path('register/', views.register, name="register"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('new_customer/', views.new_customer, name='new_customer'),
    path('get_customers/', views.get_customers, name='get_customers'),
    path('activate/', views.activate, name='activate'),
    path('update_job/', views.update_job, name='update_job'),
    path('history/', views.history, name="history"),
    path('unpaid/', views.unpaid, name="unpaid"),
    path('edit_customer/', views.edit_customer, name="edit_customer"),
    path('delete_customer/', views.delete_customer, name="delete_customer"),
    path('activate/<uid>/<token>/', views.activate_account, name='activate_account'),
    path('add_to_worksheet/', views.add_to_worksheet, name='add_to_worksheet'),
    path('get_worksheet/', views.get_worksheet, name='get_worksheet'),
]