from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView

from .serializers import (
	PasswordResetConfirmSerializer,
	PasswordResetRequestSerializer,
	RegistrationSerializer,
	UserProfileSerializer,
)

User = get_user_model()


class RegisterView(APIView):
	permission_classes = (AllowAny,)

	def post(self, request):
		serializer = RegistrationSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response(RegistrationSerializer(user).data, status=201)


class CurrentUserView(RetrieveUpdateAPIView):
	serializer_class = UserProfileSerializer

	def get_object(self):
		return self.request.user


class PasswordResetRequestView(APIView):
	permission_classes = (AllowAny,)

	def post(self, request):
		serializer = PasswordResetRequestSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		email = serializer.validated_data['email'].strip().lower()
		user = User.objects.filter(email__iexact=email, is_active=True).first()
		if user:
			uid = urlsafe_base64_encode(force_bytes(user.pk))
			token = default_token_generator.make_token(user)
			reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password/{uid}/{token}"
			context = {'reset_url': reset_url, 'username': user.username}
			text_body = (
				f"Use this link to choose a new ApiForge password:\n\n{reset_url}\n\n"
				"This link expires after it is used or when your password changes."
			)
			message = EmailMultiAlternatives(
				'Reset your ApiForge password',
				text_body,
				settings.DEFAULT_FROM_EMAIL,
				[user.email],
			)
			message.attach_alternative(
				render_to_string('accounts/password_reset_email.html', context),
				'text/html',
			)
			message.send()

		return Response({'detail': 'If an account matches that email, a reset link has been sent.'})


class PasswordResetConfirmView(APIView):
	permission_classes = (AllowAny,)

	def post(self, request):
		serializer = PasswordResetConfirmSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			user = User.objects.get(pk=force_str(urlsafe_base64_decode(serializer.validated_data['uid'])))
		except (TypeError, ValueError, OverflowError, User.DoesNotExist):
			return Response({'detail': 'This password reset link is invalid or expired.'}, status=400)

		if not default_token_generator.check_token(user, serializer.validated_data['token']):
			return Response({'detail': 'This password reset link is invalid or expired.'}, status=400)

		user.set_password(serializer.validated_data['password'])
		user.save(update_fields=['password'])
		return Response({'detail': 'Your password has been reset. You can sign in now.'})
