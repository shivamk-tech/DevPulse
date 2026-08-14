from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import MonitersSerializers
from .models import Moniters
from .services import create_moniters



# Create your views here.
class MoniterListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        moniters = request.user.moniters.all()
        serializer = MonitersSerializers(
            moniters,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        
        serializer = MonitersSerializers(data=request.data)

        serializer.is_valid(raise_exception=True)

        moniters = create_moniters(
            user=request.user,
            validated_data=serializer.validated_data,
        )

        return Response(
            MonitersSerializers(moniters).data,
            status=status.HTTP_201_CREATED
        )

    
    

        