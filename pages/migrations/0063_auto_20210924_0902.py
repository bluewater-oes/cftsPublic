# Generated by Django 2.1.12 on 2021-09-24 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0062_auto_20210914_0642'),
    ]

    operations = [
        migrations.AddField(
            model_name='request',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
    ]
