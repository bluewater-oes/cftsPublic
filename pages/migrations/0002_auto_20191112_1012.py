# Generated by Django 2.1.12 on 2019-11-12 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='classification',
            options={'ordering': ['SortOrder']},
        ),
        migrations.AddField(
            model_name='classification',
            name='SortOrder',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]