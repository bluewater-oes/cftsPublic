# Generated by Django 2.1.12 on 2020-10-09 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0041_resourcelink'),
    ]

    operations = [
        migrations.AddField(
            model_name='resourcelink',
            name='file_object',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]