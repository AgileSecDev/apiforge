from django.db import models
from workspaces.models import Workspace


class Environment(models.Model):
	workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='environments')
	name = models.CharField(max_length=120)
	variables = models.JSONField(default=dict, blank=True)
	is_active = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('name',)
		constraints = [
			models.UniqueConstraint(fields=('workspace', 'name'), name='unique_environment_name_per_workspace'),
		]

	def __str__(self):
		return self.name
