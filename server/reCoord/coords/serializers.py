from rest_framework import serializers

from .models import Coord


class CoordSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Coord
        fields = "__all__"
