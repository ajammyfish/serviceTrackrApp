# Generated by Django 4.1.7 on 2023-05-21 16:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_userprofile_round_schedule'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='round_name',
        ),
    ]
