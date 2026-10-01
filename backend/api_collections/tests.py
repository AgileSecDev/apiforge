from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class CollectionAPITests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user = get_user_model().objects.create_user(username='collection_user', password='StrongPass!42')
		self.other = get_user_model().objects.create_user(username='other_user', password='StrongPass!42')
		self.client.force_authenticate(self.user)

	def test_user_can_create_and_list_collections(self):
		create = self.client.post('/api/collections/', {'name': 'Users API', 'description': 'User endpoints'}, format='json')
		self.assertEqual(create.status_code, 201)
		self.assertEqual(create.data['name'], 'Users API')
		self.assertEqual(create.data['requests'], [])
		listing = self.client.get('/api/collections/')
		self.assertEqual(listing.status_code, 200)
		self.assertEqual(len(listing.data), 1)

	def test_collection_requests_are_nested_and_isolated_by_owner(self):
		collection = self.client.post('/api/collections/', {'name': 'Orders'}, format='json').data
		request = self.client.post('/api/requests/', {
			'collection': collection['id'], 'name': 'List orders', 'method': 'GET', 'url': 'https://api.example.com/orders'
		}, format='json')
		self.assertEqual(request.status_code, 201)
		self.assertEqual(self.client.get(f"/api/collections/{collection['id']}/").data['requests'][0]['name'], 'List orders')
		self.client.force_authenticate(self.other)
		self.assertEqual(self.client.get(f"/api/collections/{collection['id']}/").status_code, 404)
