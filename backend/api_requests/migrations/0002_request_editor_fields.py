from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [('api_requests', '0001_initial')]

    operations = [
        migrations.AddField('apirequest', 'description', models.TextField(blank=True)),
        migrations.AddField('apirequest', 'body_mode', models.CharField(choices=[('none', 'No body'), ('form-data', 'form-data'), ('x-www-form-urlencoded', 'x-www-form-urlencoded'), ('raw', 'Raw'), ('binary', 'Binary')], default='none', max_length=24)),
        migrations.AddField('apirequest', 'raw_language', models.CharField(choices=[('json', 'JSON'), ('javascript', 'JavaScript'), ('text', 'Text'), ('html', 'HTML'), ('xml', 'XML')], default='json', max_length=16)),
        migrations.AddField('apirequest', 'scripts', models.JSONField(blank=True, default=dict)),
        migrations.AddField('apirequest', 'settings', models.JSONField(blank=True, default=dict)),
    ]
