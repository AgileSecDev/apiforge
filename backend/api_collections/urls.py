from django.urls import path

from .views import CollectionDetailView, CollectionListCreateView

urlpatterns = [
	path('', CollectionListCreateView.as_view(), name='collection-list'),
	path('<int:pk>/', CollectionDetailView.as_view(), name='collection-detail'),
]
