# Generated by Django 5.0 on 2023-12-15 08:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('IRDIP', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='company',
            name='root_account',
        ),
    ]