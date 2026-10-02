from django.db import models
from api_collections.models import Collection


class ApiRequest(models.Model):
	class Method(models.TextChoices):
		GET = 'GET', 'GET'
		POST = 'POST', 'POST'
		PUT = 'PUT', 'PUT'
		PATCH = 'PATCH', 'PATCH'
		DELETE = 'DELETE', 'DELETE'

	class AuthType(models.TextChoices):
		NONE = 'none', 'None'
		BEARER = 'bearer', 'Bearer token'
		API_KEY = 'api_key', 'API key'
		BASIC = 'basic', 'Basic auth'

	class BodyMode(models.TextChoices):
		NONE = 'none', 'No body'
		FORM_DATA = 'form-data', 'form-data'
		URL_ENCODED = 'x-www-form-urlencoded', 'x-www-form-urlencoded'
		RAW = 'raw', 'Raw'
		BINARY = 'binary', 'Binary'

	class RawLanguage(models.TextChoices):
		JSON = 'json', 'JSON'
		JAVASCRIPT = 'javascript', 'JavaScript'
		TEXT = 'text', 'Text'
		HTML = 'html', 'HTML'
		XML = 'xml', 'XML'

	collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name='requests')
	name = models.CharField(max_length=120)
	method = models.CharField(max_length=8, choices=Method.choices, default=Method.GET)
	url = models.CharField(max_length=2048)
	description = models.TextField(blank=True)
	query_params = models.JSONField(default=dict, blank=True)
	headers = models.JSONField(default=dict, blank=True)
	body = models.TextField(blank=True)
	body_mode = models.CharField(max_length=24, choices=BodyMode.choices, default=BodyMode.NONE)
	raw_language = models.CharField(max_length=16, choices=RawLanguage.choices, default=RawLanguage.JSON)
	auth_type = models.CharField(max_length=16, choices=AuthType.choices, default=AuthType.NONE)
	auth_config = models.JSONField(default=dict, blank=True)
	scripts = models.JSONField(default=dict, blank=True)
	settings = models.JSONField(default=dict, blank=True)
	position = models.PositiveIntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('position', 'name')

	def __str__(self):
		return f'{self.method} {self.name}'
