from rest_framework import serializers

from .models import Coord, Clip, Video, Fingerprint


class CoordSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Coord
        fields = "__all__"


class ClipSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Clip
        fields = "__all__"


class VideoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Video
        fields = "__all__"


class FingerprintSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Fingerprint
        fields = "__all__"
