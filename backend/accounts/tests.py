from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class RegistrationAPITests(TestCase):
	endpoint = '/api/accounts/register/'

	def setUp(self):
		self.client = APIClient()
		self.user_data = {
			'username': 'api_forge_user',
			'email': 'developer@example.com',
			'password': 'LongAndUniquePassword!42',
			'password_confirm': 'LongAndUniquePassword!42',
		}

	def test_register_creates_user_with_hashed_password(self):
		response = self.client.post(self.endpoint, self.user_data, format='json')

		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.data['username'], self.user_data['username'])
		self.assertNotIn('password', response.data)
		user = get_user_model().objects.get(username=self.user_data['username'])
		self.assertTrue(user.check_password(self.user_data['password']))

	def test_register_rejects_mismatched_passwords(self):
		data = {**self.user_data, 'password_confirm': 'a-different-password'}

		response = self.client.post(self.endpoint, data, format='json')

		self.assertEqual(response.status_code, 400)
		self.assertIn('password_confirm', response.data)

	def test_register_rejects_duplicate_email_case_insensitively(self):
		self.client.post(self.endpoint, self.user_data, format='json')
		data = {
			**self.user_data,
			'username': 'another_api_user',
			'email': self.user_data['email'].upper(),
		}

		response = self.client.post(self.endpoint, data, format='json')

		self.assertEqual(response.status_code, 400)
		self.assertIn('email', response.data)

	def test_registered_user_can_obtain_jwt_tokens(self):
		self.client.post(self.endpoint, self.user_data, format='json')

		response = self.client.post(
			'/api/auth/token/',
			{'username': self.user_data['username'], 'password': self.user_data['password']},
			format='json',
		)

		self.assertEqual(response.status_code, 200)
		self.assertIn('access', response.data)
		self.assertIn('refresh', response.data)


class UserProfileAPITests(TestCase):
	endpoint = '/api/accounts/me/'

	def setUp(self):
		self.client = APIClient()
		self.user = get_user_model().objects.create_user(
			username='profile_user',
			email='profile@example.com',
			password='LongAndUniquePassword!42',
		)

	def test_profile_requires_authentication(self):
		response = self.client.get(self.endpoint)

		self.assertEqual(response.status_code, 401)

	def test_profile_returns_safe_account_details(self):
		self.client.force_authenticate(self.user)

		response = self.client.get(self.endpoint)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data['username'], self.user.username)
		self.assertEqual(response.data['email'], self.user.email)
		self.assertNotIn('password', response.data)

	def test_profile_updates_username_and_email(self):
		self.client.force_authenticate(self.user)

		response = self.client.patch(
			self.endpoint,
			{'username': 'updated_profile', 'email': 'UPDATED@example.com'},
			format='json',
		)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data['username'], 'updated_profile')
		self.assertEqual(response.data['email'], 'updated@example.com')
