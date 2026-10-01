from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import ApiRequest
from .serializers import ApiRequestSerializer


class ApiRequestListCreateView(ListCreateAPIView):
	serializer_class = ApiRequestSerializer

	def get_queryset(self):
		return ApiRequest.objects.filter(collection__workspace__owner=self.request.user)

	def perform_create(self, serializer):
		collection = serializer.validated_data['collection']
		if collection.workspace.owner_id != self.request.user.id:
			from rest_framework.exceptions import PermissionDenied
			raise PermissionDenied('You do not own this collection.')
		serializer.save()


class ApiRequestDetailView(RetrieveUpdateDestroyAPIView):
	serializer_class = ApiRequestSerializer

	def get_queryset(self):
		return ApiRequest.objects.filter(collection__workspace__owner=self.request.user)

# Create your views here.
