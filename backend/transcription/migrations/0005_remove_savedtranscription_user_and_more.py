# Generated by Django 4.2.17 on 2024-12-21 15:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
        ('transcription', '0004_alter_savedtranscription_score_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='savedtranscription',
            name='user',
        ),
        migrations.AddField(
            model_name='savedtranscription',
            name='user_profile',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='saved_transcriptions', to='authentication.userprofile'),
        ),
    ]