# Generated by Django 4.1.7 on 2023-05-21 14:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='round_schedule',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]