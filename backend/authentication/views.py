from django.shortcuts import render

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.decorators import api_view
from rest_framework import response, status, permissions
from rest_framework.generics import GenericAPIView
from django.contrib.auth import authenticate

class AuthUserAPIView(GenericAPIView):

    permission_class = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user

        serializer =  RegisterSerializer(user)

        return response.Response({'user': serializer.data})

class RegisterAPIView(GenericAPIView):

    serializer_class=RegisterSerializer
    def post(self,request):
        serializer=self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(GenericAPIView):
    serializer_class=LoginSerializer

    def post(self, request):
        email=request.data.get('email', None)
        password=request.data.get('password', None)

        user = authenticate(email=email, password=password)

        if user:
            serializer=self.serializer_class(user)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        return response.Response({'message': 'invalid credentials try again'}, status=status.HTTP_401_UNAUTHORIZED)
    
# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)

#         # Add custom claims
#         token['username'] = user.username
#         token['email'] = user.email
#         # ...

#         return token
    
# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#         serializer=UserSerializerWithToken(self.user).data
#         for k,v in serializer.items():
#             data[k]=v

#         return data
    
# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class=MyTokenObtainPairSerializer

# @api_view(['GET'])
# def getUserProfile(request):
#     user=request.user
#     serializer=UserSerializer(user, many=False)
#     return Response(serializer.data)
