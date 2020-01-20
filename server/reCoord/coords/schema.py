import graphene

from graphene_django.types import DjangoObjectType

from .models import Coord, Clip, Fingerprint, Video


class CoordType(DjangoObjectType):
    class Meta:
        model = Coord


class ClipType(DjangoObjectType):
    class Meta:
        model = Clip


class VideoType(DjangoObjectType):
    class Meta:
        model = Video


class FingerprintType(DjangoObjectType):
    class Meta:
        model = Fingerprint


class Query(object):
    all_coords = graphene.List(CoordType)
    all_clips = graphene.List(ClipType)
    all_videos = graphene.List(VideoType)
    all_fingerprints = graphene.List(FingerprintType)

    def resolve_all_coords(self, info, **kwargs):
        return Coord.objects.all()

    def resolve_all_clips(self, info, **kwargs):
        # We can easily optimize query count in the resolve method
        return Clip.objects.select_related("coord").all()

    def resolve_all_videos(self, info, **kwargs):
        return Video.objects.select_related("clip").all()

    def resolve_all_fingerprints(self, info, **kwargs):
        return Fingerprint.objects.select_related("video").all()
