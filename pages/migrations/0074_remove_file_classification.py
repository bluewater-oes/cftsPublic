# Generated by Django 3.2.7 on 2021-11-15 12:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0073_auto_20211026_0913'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='file',
            name='classification',
        ),
    ]
