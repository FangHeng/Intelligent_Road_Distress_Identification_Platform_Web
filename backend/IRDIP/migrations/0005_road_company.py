# Generated by Django 5.0 on 2023-12-16 09:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('IRDIP', '0004_userrole_gender'),
    ]

    operations = [
        migrations.AddField(
            model_name='road',
            name='company',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='IRDIP.company'),
            preserve_default=False,
        ),
    ]