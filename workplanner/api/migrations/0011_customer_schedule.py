# Generated by Django 4.2 on 2023-06-04 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_customer_email_customer_name_customer_notes_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='schedule',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
