from django.urls import path

from .views import CurrentUserView, RegisterView

urlpatterns = []

urlpatterns = [
	path('register/', RegisterView.as_view(), name='register'),
	path('me/', CurrentUserView.as_view(), name='current_user'),
]
