from django.urls import path

from .views import (
	CurrentUserView,
	PasswordResetConfirmView,
	PasswordResetRequestView,
	RegisterView,
)

urlpatterns = []

urlpatterns = [
	path('register/', RegisterView.as_view(), name='register'),
	path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
	path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
	path('me/', CurrentUserView.as_view(), name='current_user'),
]
