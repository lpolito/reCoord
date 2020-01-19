from rest_framework import viewsets

from .serializers import CoordSerializer
from .models import Coord


class CoordsViewSet(viewsets.ModelViewSet):
    queryset = Coord.objects.all().order_by("name")
    serializer_class = CoordSerializer
