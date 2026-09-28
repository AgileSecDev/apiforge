from django.db import models
from django.conf import settings
from workspaces.models import Workspace


class RequestHistory(models.Model):
	class Method(models.TextChoices):
		GET = 'GET', 'GET'
		POST = 'POST', 'POST'
		PUT = 'PUT', 'PUT'
		PATCH = 'PATCH', 'PATCH'
		DELETE = 'DELETE', 'DELETE'

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='request_history')
	workspace = models.ForeignKey(
		Workspace,
		on_delete=models.SET_NULL,
		related_name='request_history',
		null=True,
		blank=True,
	)
	method = models.CharField(max_length=8, choices=Method.choices)
	url = models.CharField(max_length=2048)
	request_headers = models.JSONField(default=dict, blank=True)
	request_body = models.TextField(blank=True)
	response_status = models.PositiveSmallIntegerField(null=True, blank=True)
	response_headers = models.JSONField(default=dict, blank=True)
	response_body = models.TextField(blank=True)
	duration_ms = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	executed_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('-executed_at',)
		indexes = [
			models.Index(fields=('user', '-executed_at'), name='history_user_time_idx'),
		]

	def __str__(self):
		return f'{self.method} {self.url}'
