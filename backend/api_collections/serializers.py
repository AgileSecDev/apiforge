from rest_framework import serializers

from api_requests.models import ApiRequest

from .models import Collection


class SavedRequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = ApiRequest
		fields = (
			'id', 'collection', 'name', 'method', 'url', 'query_params',
			'headers', 'body', 'auth_type', 'auth_config', 'position',
			'created_at', 'updated_at',
		)
		read_only_fields = ('id', 'created_at', 'updated_at')


class CollectionSerializer(serializers.ModelSerializer):
	requests = SavedRequestSerializer(many=True, read_only=True)

	class Meta:
		model = Collection
		fields = ('id', 'name', 'description', 'requests', 'created_at', 'updated_at')
		read_only_fields = ('id', 'requests', 'created_at', 'updated_at')
