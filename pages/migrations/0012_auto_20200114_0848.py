# Generated by Django 2.1.12 on 2020-01-14 13:48

from django.db import migrations, models
import pages.models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0011_auto_20191121_1345'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='file',
            name='filename',
        ),
        migrations.RemoveField(
            model_name='file',
            name='path',
        ),
        migrations.RemoveField(
            model_name='file',
            name='size',
        ),
        migrations.AddField(
            model_name='user',
            name='name_first',
            field=models.CharField(default='default', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='name_last',
            field=models.CharField(default='default', max_length=50),
            preserve_default=False,
        ),
    ]