from django.urls import path

from .views import ApiRequestDetailView, ApiRequestListCreateView

urlpatterns = [
	path('', ApiRequestListCreateView.as_view(), name='request-list'),
	path('<int:pk>/', ApiRequestDetailView.as_view(), name='request-detail'),
]
