# Generated by Django 3.1.6 on 2021-03-17 12:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_auto_20210317_1420'),
    ]

    operations = [
        migrations.RenameField(
            model_name='country',
            old_name='code',
            new_name='countrycode',
        ),
    ]
