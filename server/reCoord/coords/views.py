from rest_framework import viewsets

from .serializers import (
    ClipSerializer,
    CoordSerializer,
    FingerprintSerializer,
    VideoSerializer,
)
from .models import Coord, Clip, Video, Fingerprint


class CoordsViewSet(viewsets.ModelViewSet):
    queryset = Coord.objects.all()
    serializer_class = CoordSerializer


class ClipsViewSet(viewsets.ModelViewSet):
    queryset = Clip.objects.all()
    serializer_class = ClipSerializer


class VideosViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class FingerprintsViewSet(viewsets.ModelViewSet):
    queryset = Fingerprint.objects.all()
    serializer_class = FingerprintSerializer
