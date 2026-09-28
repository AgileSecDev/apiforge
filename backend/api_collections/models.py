from django.db import models
from workspaces.models import Workspace


class Collection(models.Model):
	workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='collections')
	name = models.CharField(max_length=120)
	description = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('name',)
		constraints = [
			models.UniqueConstraint(fields=('workspace', 'name'), name='unique_collection_name_per_workspace'),
		]

	def __str__(self):
		return self.name
