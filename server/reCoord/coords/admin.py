from django.contrib import admin
from .models import Clip, Coord, Fingerprint, Video

# Register your models here.
admin.site.register(Coord)
admin.site.register(Clip)
admin.site.register(Video)
admin.site.register(Fingerprint)
