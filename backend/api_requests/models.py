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

	collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name='requests')
	name = models.CharField(max_length=120)
	method = models.CharField(max_length=8, choices=Method.choices, default=Method.GET)
	url = models.CharField(max_length=2048)
	query_params = models.JSONField(default=dict, blank=True)
	headers = models.JSONField(default=dict, blank=True)
	body = models.TextField(blank=True)
	auth_type = models.CharField(max_length=16, choices=AuthType.choices, default=AuthType.NONE)
	auth_config = models.JSONField(default=dict, blank=True)
	position = models.PositiveIntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('position', 'name')

	def __str__(self):
		return f'{self.method} {self.name}'
