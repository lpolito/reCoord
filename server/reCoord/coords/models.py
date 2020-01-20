from django.db import models
from django.utils.translation import gettext_lazy as _
from reCoord.common.models import BaseModel


class Coord(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Clip(BaseModel):
    # In seconds, number up to 99999.99
    time_position = models.DecimalField(max_digits=7, decimal_places=2)
    video_ref = None

    coord = models.ForeignKey("Coord", on_delete=models.CASCADE)
    video = models.ForeignKey("Video", on_delete=models.CASCADE)

    def __str__(self):
        return "coord id: " + self.coord + " <- video: " + self.video


class Video(BaseModel):
    class VideoOrigin(models.TextChoices):
        YOUTUBE = "youtube", _("YouTube")

    origin = models.CharField(
        max_length=20, choices=VideoOrigin.choices, default=VideoOrigin.YOUTUBE
    )

    title = models.CharField(max_length=100)
    # In seconds, number up to 99999.99
    duration = models.DecimalField(max_digits=7, decimal_places=2)
    # Arbitrary length for now, not sure a good limit.
    origin_id = models.CharField(max_length=50)

    def __str__(self):
        return '"' + self.title + '" from ' + self.origin


class Fingerprint(models.Model):
    # Length of hash must match FINGERPRINT_REDUCTION in fingerprint utility.
    hash = models.CharField(max_length=20, db_index=True)
    # In seconds, number up to 99999.99
    time_offset = models.DecimalField(max_digits=7, decimal_places=2)

    video = models.ForeignKey("Video", on_delete=models.CASCADE)

    def __str__(self):
        return "[" + self.hash + "," + self.time_offset + "] in " + self.video

    # Make Fingerprint essentially read-only after creation.
    def get_readonly_fields(self, request, obj=None):
        # obj is None during the object creation
        if obj:
            return ["hash", "time_offset", "video_id"]
        else:
            return []
