from django.contrib import admin

# Register your models here.

from .models import Venue, VenueRepairRequest

admin.site.register(Venue)
admin.site.register(VenueRepairRequest)