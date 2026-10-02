from rest_framework import serializers

from .models import ApiRequest


class ApiRequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = ApiRequest
		fields = (
			'id', 'collection', 'name', 'method', 'url', 'description', 'query_params',
			'headers', 'body', 'body_mode', 'raw_language', 'auth_type', 'auth_config',
			'scripts', 'settings', 'position',
			'created_at', 'updated_at',
		)
		read_only_fields = ('id', 'created_at', 'updated_at')
