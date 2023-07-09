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
    path('change_worksheet_date/', views.change_worksheet_date, name='change_worksheet_date'),
    path('update_worksheet_job/', views.update_worksheet_job, name='update_worksheet_job'),
    path('delete_worksheet_job/', views.delete_worksheet_job, name='delete_worksheet_job'),
    path('reset_password/', views.reset_password, name='reset_password'),
    path('delete_account/', views.delete_account, name='delete_account'),
    path('change_business_name/', views.change_business_name, name="change_business_name"),
    path('change_business_type/', views.change_business_type, name="change_business_type"),
    path('change_round_schedule/', views.change_round_schedule, name="change_round_schedule"),
    path('get_expenses/', views.get_expenses, name='get_expenses'),
    path('add_expense/', views.add_expense, name="add_expense"),
    path('add_one_off/', views.add_one_off, name="add_one_off"),
]