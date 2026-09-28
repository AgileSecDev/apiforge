from django.db import models
from django.conf import settings


class Workspace(models.Model):
	owner = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='workspaces',
	)
	name = models.CharField(max_length=120)
	description = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('name',)
		constraints = [
			models.UniqueConstraint(fields=('owner', 'name'), name='unique_workspace_name_per_owner'),
		]

	def __str__(self):
		return self.name
