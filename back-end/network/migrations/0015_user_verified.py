# Generated by Django 3.1.7 on 2021-04-30 07:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0014_user_last_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='verified',
            field=models.BooleanField(default=False),
        ),
    ]
