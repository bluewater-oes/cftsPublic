# Generated by Django 2.1.12 on 2021-05-10 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0051_user_is_centcom'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is_centcom',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
