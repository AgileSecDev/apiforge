from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView

from .serializers import RegistrationSerializer, UserProfileSerializer


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
