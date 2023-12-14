# Generated by Django 5.0 on 2023-12-14 19:16

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Road',
            fields=[
                ('road_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('road_name', models.CharField(max_length=255)),
                ('gps_longitude', models.DecimalField(decimal_places=6, max_digits=10)),
                ('gps_latitude', models.DecimalField(decimal_places=6, max_digits=10)),
                ('administrative_province', models.CharField(max_length=100)),
                ('administrative_city', models.CharField(max_length=100)),
                ('administrative_district', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('company_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('company_name', models.CharField(max_length=255)),
                ('employee_number_length', models.IntegerField()),
                ('root_account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UploadRecord',
            fields=[
                ('upload_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('upload_time', models.DateTimeField()),
                ('folder_url', models.CharField(max_length=255)),
                ('upload_name', models.CharField(max_length=255)),
                ('upload_count', models.IntegerField()),
                ('road', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IRDIP.road')),
                ('uploader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FileUpload',
            fields=[
                ('file_id', models.AutoField(primary_key=True, serialize=False)),
                ('file_url', models.CharField(max_length=255)),
                ('classification_result', models.IntegerField(choices=[(0, 'Class 0'), (1, 'Class 1'), (2, 'Class 2'), (3, 'Class 3'), (4, 'Class 4'), (5, 'Class 5'), (6, 'Class 6'), (7, 'Class 7')])),
                ('confidence', models.DecimalField(decimal_places=4, max_digits=5)),
                ('upload', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IRDIP.uploadrecord')),
            ],
        ),
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee_number', models.CharField(max_length=255)),
                ('user_level', models.IntegerField(choices=[(0, 'Level 0'), (1, 'Level 1'), (2, 'Level 2')])),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('avatar_url', models.URLField(blank=True, null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IRDIP.company')),
                ('supervisor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='IRDIP.userrole')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]