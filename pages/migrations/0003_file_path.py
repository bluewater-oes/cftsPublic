# Generated by Django 2.1.12 on 2019-11-12 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0002_auto_20191112_1012'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='Path',
            field=models.CharField(default=None, max_length=100),
            preserve_default=False,
        ),
    ]
