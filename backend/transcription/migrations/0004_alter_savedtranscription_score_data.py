# Generated by Django 4.2.17 on 2024-12-19 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcription', '0003_alter_savedtranscription_score_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savedtranscription',
            name='score_data',
            field=models.FileField(upload_to='score_data/'),
        ),
    ]