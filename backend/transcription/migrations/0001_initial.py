# Generated by Django 4.2.17 on 2024-12-06 06:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SavedTranscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('author', models.CharField(max_length=255)),
                ('categories', models.JSONField()),
                ('score_data', models.JSONField()),
                ('is_published', models.BooleanField(default=False)),
                ('audio_file', models.FileField(upload_to='audio_files/')),
                ('image_file', models.ImageField(blank=True, null=True, upload_to='image_files/')),
                ('saves', models.IntegerField(default=0)),
            ],
        ),
    ]