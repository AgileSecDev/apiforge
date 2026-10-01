from rest_framework import serializers

from .models import ApiRequest


class ApiRequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = ApiRequest
		fields = (
			'id', 'collection', 'name', 'method', 'url', 'query_params',
			'headers', 'body', 'auth_type', 'auth_config', 'position',
			'created_at', 'updated_at',
		)
		read_only_fields = ('id', 'created_at', 'updated_at')
