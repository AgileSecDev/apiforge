from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
	email = serializers.EmailField(required=True)
	password = serializers.CharField(write_only=True, min_length=8, validators=[validate_password])
	password_confirm = serializers.CharField(write_only=True)

	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'password', 'password_confirm')
		read_only_fields = ('id',)

	def validate_email(self, email):
		normalized_email = email.strip().lower()
		if User.objects.filter(email__iexact=normalized_email).exists():
			raise serializers.ValidationError('An account with this email already exists.')
		return normalized_email

	def validate(self, attrs):
		if attrs['password'] != attrs['password_confirm']:
			raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
		return attrs

	def create(self, validated_data):
		validated_data.pop('password_confirm')
		return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'date_joined')
		read_only_fields = ('id', 'date_joined')

	def validate_email(self, email):
		normalized_email = email.strip().lower()
		if User.objects.filter(email__iexact=normalized_email).exclude(pk=self.instance.pk).exists():
			raise serializers.ValidationError('An account with this email already exists.')
		return normalized_email


class PasswordResetRequestSerializer(serializers.Serializer):
	email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
	uid = serializers.CharField()
	token = serializers.CharField()
	password = serializers.CharField(write_only=True, min_length=8, validators=[validate_password])
	password_confirm = serializers.CharField(write_only=True)

	def validate(self, attrs):
		if attrs['password'] != attrs['password_confirm']:
			raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
		return attrs
