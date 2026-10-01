from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView

from workspaces.models import Workspace

from .models import Collection
from .serializers import CollectionSerializer


def personal_workspace(user):
	workspace, _ = Workspace.objects.get_or_create(owner=user, name='Personal workspace')
	return workspace


class CollectionListCreateView(ListCreateAPIView):
	serializer_class = CollectionSerializer

	def get_queryset(self):
		return Collection.objects.filter(workspace__owner=self.request.user).prefetch_related('requests')

	def perform_create(self, serializer):
		serializer.save(workspace=personal_workspace(self.request.user))


class CollectionDetailView(RetrieveUpdateDestroyAPIView):
	serializer_class = CollectionSerializer

	def get_queryset(self):
		return Collection.objects.filter(workspace__owner=self.request.user).prefetch_related('requests')

# Create your views here.
