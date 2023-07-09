from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegistrationSerializer, HistorySerializer, CustomerSerializer, ProfileSerializer, ExpensesSerializer
from .models import User, Customer, History, UserProfile, Expenses
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.utils.dateparse import parse_date

from django.core.mail import send_mail

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.contrib import messages
from django.template.loader import render_to_string
from django.utils.html import strip_tags


@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('pwd')

    print(username, password)
    user = authenticate(request, username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        user_profile = UserProfile.objects.get(user=user)
        response_data = {
            'message': 'Login successful.',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'profile': {
                'business_type': user_profile.business_type,
                'business_name': user_profile.business_name,
                'round_schedule': user_profile.round_schedule,
                'is_account_setup': user_profile.is_account_setup,
            }
        }
        return Response(response_data, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid email or password.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register(request):
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        #token = default_token_generator.make_token(user)
        #uid = user.id
        #activation_link = f"http://localhost:8000/api/activate/{uid}/{token}/"
        #template = render_to_string('activation_email.html', {'user': user.email, 'link': activation_link})
        #send_mail('Verify Account With ServiceTrackr', template, 'serviceTrackrApp@gmail.com', [user.email])
        return Response({'message': 'Account created!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def activate_account(request, uid, token):
    try:
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        messages.success(request, 'Your account has been activated. You can now log in.')
        return redirect('http://localhost:3000/login/')  # Redirect to the login page or any other desired page
    else:
        messages.error(request, 'Invalid activation link.')
        return redirect('http://localhost:3000/') 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def new_customer(request):
    data = request.data
    data['owner'] = request.user.id
    data['price'] = int(data['price'])  # Convert price to an integer
    data['due_date'] = datetime.strptime(data['due_date'], '%Y-%m-%d').date()  # Parse due_date as a date object
    
    if data['schedule'] == '':
        data['schedule'] = 0
    
    if data['phone'] == '':
        del data['phone']
    else:
        data['phone'] = int(data['phone'])

    print(data)

    serializer = CustomerSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_customers(request):
    user = request.user
    customers = user.customer_set.filter(is_deleted=False).order_by('due_date')
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def activate(request):
    user = request.user
    data = request.data
    profile = user.profile
    profile.business_type = data.get('business')
    profile.business_name = data.get('name')
    profile.round_schedule = data.get('schedule')
    profile.is_account_setup = True
    profile.save()

    serializer = ProfileSerializer(profile)
    return Response({'message': 'Profile activated successfully', 'profile': serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_job(request):
    customer_id = request.data.get('customerId')
    payment_method = request.data.get('paymentMethod')

    # Check valid data
    if customer_id is None or payment_method is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    # Get customer and schedule
    customer = Customer.objects.get(id=customer_id)
    user_profile = UserProfile.objects.get(user=request.user)
    schedule = user_profile.round_schedule
    specific_schedule = customer.schedule
    
    # New history instance
    history = History.objects.create(
    owner=request.user,
    customer=customer,
    date=customer.due_date,
    payment_amount=customer.price,
    payment_method=payment_method
    )

    # Set new date for customer
    if specific_schedule == 0:
        new_date = customer.due_date + timedelta(weeks=schedule)
    else:
        new_date = customer.due_date + timedelta(weeks=specific_schedule)
    customer.due_date = new_date
    customer.save()

    customers = request.user.customer_set.filter(is_deleted=False).order_by('due_date')
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history(request):
    history = History.objects.filter(owner=request.user).order_by('date')
    serializer = HistorySerializer(history, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unpaid(request):
    history_id = request.data.get('customerId')
    payment_method = request.data.get('paymentMethod')

    # Check valid data
    if history_id is None or payment_method is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    # Change history instance
    history = History.objects.get(id=history_id)
    history.payment_method = payment_method
    history.save()


    customers = request.user.customer_set.filter(is_deleted=False).order_by('due_date')
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_customer(request):
    data = request.data
    print(data)
    customer_id = request.data.get('customerId')

    # Check valid data
    if customer_id is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    # Get customer and schedule
    customer = Customer.objects.get(id=customer_id)
    customer.due_date = data.get('due_date')
    customer.price = data.get('price')
    customer.address = data.get('address')
    customer.name = data.get('name')
    customer.email = data.get('email')
    customer.notes = data.get('notes')

    if data['phone'] == '':
        customer.phone = None
    else:
        customer.phone = data.get('phone')

    if data.get('schedule') == '':
        customer.schedule = 0
    else:
        customer.schedule = data.get('schedule')

    customer.save()

    customers = request.user.customer_set.filter(is_deleted=False).order_by('due_date')
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_customer(request):
    data = request.data
    customer_id = request.data.get('customerId')

    # Check valid data
    if customer_id is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    # Get customer and schedule
    customer = Customer.objects.get(id=customer_id)
    customer.is_deleted = True
    customer.save()

    customers = request.user.customer_set.filter(is_deleted=False).order_by('due_date')
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_worksheet(request):
    print(request.data)

    for key in request.data:
        # Get the customer by ID
        customer = Customer.objects.get(id=key)
        date = request.data[key]
        print(customer)
        print(date)

        # Update the customer fields
        customer.in_worksheet = True
        customer.worksheet_date = datetime.strptime(date, '%Y-%m-%d').date()
        customer.save()

    return Response({'message': 'Recieved'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_worksheet(request):
    user = request.user
    customers = user.customer_set.filter(is_deleted=False, in_worksheet=True)
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_worksheet_date(request):
    customer_id = request.data.get('customerId')
    worksheet_date_str = request.data.get('worksheetDate')

    # Check valid data
    if customer_id is None or worksheet_date_str is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    # Get customer and schedule
    customer = Customer.objects.get(id=customer_id)

    worksheet_date = parse_date(worksheet_date_str)

    # Set new date for customer
    customer.worksheet_date = worksheet_date
    customer.save()

    customers = request.user.customer_set.filter(is_deleted=False, in_worksheet=True)
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_worksheet_job(request):
    customer_id = request.data.get('customerId')
    payment_method = request.data.get('paymentMethod')
    worksheet_date_str = request.data.get('worksheetDate')

    # Check valid data
    if customer_id is None or payment_method is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    # Get customer and schedule
    customer = Customer.objects.get(id=customer_id)
    user_profile = UserProfile.objects.get(user=request.user)
    schedule = user_profile.round_schedule
    specific_schedule = customer.schedule

    worksheet_date = parse_date(worksheet_date_str)

    
    # New history instance
    history = History.objects.create(
    owner=request.user,
    customer=customer,
    date=worksheet_date,
    payment_amount=customer.price,
    payment_method=payment_method
    )

    if customer.non_recurring == False:
        # Set new date for customer
        if specific_schedule == 0:
            new_date = worksheet_date + timedelta(weeks=schedule)
        else:
            new_date = worksheet_date + timedelta(weeks=specific_schedule)
        customer.due_date = new_date
        customer.in_worksheet = False
        customer.worksheet_date = None
        customer.save()
    
    else:
        customer.is_deleted = True
        customer.save()

    customers = request.user.customer_set.filter(is_deleted=False, in_worksheet=True)
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_worksheet_job(request):

    customer_id = request.data.get('customerId')

    # Check valid data
    if customer_id is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    # Get customer and schedule
    customer = Customer.objects.get(id=customer_id)

    if customer.non_recurring == False:
        customer.in_worksheet = False
        customer.worksheet_date = None
        customer.save()
    else:
        customer.delete()

    customers = request.user.customer_set.filter(is_deleted=False, in_worksheet=True)
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_password(request):
    passwords = request.data
    print(passwords)
    user = request.user
    cur_password = passwords.get('curPassword')
    new_password = passwords.get('newPassword')

    if not user.check_password(cur_password):
        return Response({'error': 'Incorrect Password.'}, status=400)
    
    user.set_password(new_password)
    user.save()

    return Response('Success', status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()
    return Response('Success', status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_business_name(request):
    print(request.data)

    new_name = request.data.get('business_name')

    if new_name is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)

    user_profile = UserProfile.objects.get(user=request.user)
    user_profile.business_name = new_name
    user_profile.save()

    user_profile = UserProfile.objects.get(user=request.user)

    response_data = {
        'message': 'Business name saved successfully.',
        'profile': {
            'business_type': user_profile.business_type,
            'business_name': user_profile.business_name,
            'round_schedule': user_profile.round_schedule,
            'is_account_setup': user_profile.is_account_setup,
        }
    }
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_business_type(request):
    print(request.data)

    new_type = request.data.get('business_type')

    if new_type is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)

    user_profile = UserProfile.objects.get(user=request.user)
    user_profile.business_type = new_type
    user_profile.save()
    
    user_profile = UserProfile.objects.get(user=request.user)

    response_data = {
        'message': 'Business type saved successfully.',
        'profile': {
            'business_type': user_profile.business_type,
            'business_name': user_profile.business_name,
            'round_schedule': user_profile.round_schedule,
            'is_account_setup': user_profile.is_account_setup,
        }
    }
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_round_schedule(request):
    print(request.data)

    new_schedule = request.data.get('schedule')

    if new_schedule is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)

    user_profile = UserProfile.objects.get(user=request.user)
    user_profile.round_schedule = new_schedule
    
    user_profile.save()

    user_profile = UserProfile.objects.get(user=request.user)

    response_data = {
        'message': 'Business name saved successfully.',
        'profile': {
            'business_type': user_profile.business_type,
            'business_name': user_profile.business_name,
            'round_schedule': user_profile.round_schedule,
            'is_account_setup': user_profile.is_account_setup,
        }
    }
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expenses(request):
    expenses = Expenses.objects.filter(user=request.user).order_by('date')
    serializer = ExpensesSerializer(expenses, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_expense(request):
    user = request.user
    expense_category = request.data.get('expense_category')
    expense_name = request.data.get('expense_name')
    cost = request.data.get('cost')
    date = request.data.get('date')

    # Check valid data
    if expense_category is None or cost is None:
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    # Create object and save
    expense = Expenses.objects.create(
    user=user,
    expense_category=expense_category,
    expense_name=expense_name,
    cost=cost,
    date=date,
    )

    expense.save()

    expenses = request.user.expenses_set.order_by('date')
    serializer = ExpensesSerializer(expenses, many=True)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_one_off(request):
    data = request.data
    data['owner'] = request.user.id
    data['price'] = int(data['price'])  # Convert price to an integer
    data['due_date'] = datetime.strptime(data['due_date'], '%Y-%m-%d').date()  # Parse due_date as a date object
    data['schedule'] = 0
    
    if data['phone'] == '':
        del data['phone']
    else:
        data['phone'] = int(data['phone'])
    
    data['worksheet_date'] = data['due_date']
    data['in_worksheet'] = True
    data['non_recurring'] = True

    print(data)

    serializer = CustomerSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)