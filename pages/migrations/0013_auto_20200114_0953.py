# Generated by Django 2.1.12 on 2020-01-14 14:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0011_auto_20191121_1345'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='classification',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='pages.Classification'),
        ),
        migrations.AlterField(
            model_name='file',
            name='rejection_reason',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='pages.Rejection'),
        ),
        migrations.AlterField(
            model_name='request',
            name='network',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='pages.Network'),
        ),
        migrations.AlterField(
            model_name='request',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='pages.User'),
        ),
    ]