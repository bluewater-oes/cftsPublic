# Generated by Django 2.1.12 on 2019-11-21 16:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    atomic = False

    dependencies = [
        ('pages', '0005_auto_20191113_1548'),
    ]

    operations = [
        migrations.RenameField(
            model_name='classification',
            old_name='Classification_id',
            new_name='classification_id',
        ),
        migrations.RenameField(
            model_name='email',
            old_name='Email_id',
            new_name='email_id',
        ),
        migrations.RenameField(
            model_name='file',
            old_name='File_id',
            new_name='file_id',
        ),
#        migrations.RenameField(
#            model_name='network',
#            old_name='Classifications',
#            new_name='classifications',
#        ),
        migrations.RenameField(
            model_name='network',
            old_name='Network_id',
            new_name='network_id',
        ),
        migrations.RenameField(
            model_name='request',
            old_name='Request_id',
            new_name='request_id',
        ),
#        migrations.RenameField(
#            model_name='request',
#            old_name='Emails',
#            new_name='target_emails',
#        ),
        migrations.RenameField(
            model_name='user',
            old_name='User_id',
            new_name='user_id',
        ),
#        migrations.AddField(
#            model_name='request',
#            name='files',
#            field=models.ManyToManyField(to='pages.File'),
#        ),
        migrations.AlterField(
            model_name='file',
            name='classification',
            field=models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='pages.Classification', to_field='classification_id'),
        ),
        migrations.AlterField(
            model_name='request',
            name='network',
            field=models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='pages.Network', to_field='network_id'),
        ),
        migrations.AlterField(
            model_name='request',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='pages.User', to_field='user_id'),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='pages.Email', to_field='email_id'),
        ),
    ]