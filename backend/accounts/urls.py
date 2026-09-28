from django.urls import path

from .views import RegisterView

urlpatterns = []

urlpatterns = [
	path('register/', RegisterView.as_view(), name='register'),
]
