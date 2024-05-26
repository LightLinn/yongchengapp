from django.contrib import admin

# Register your models here.

from .models import Venue, VenueInspectionRecord, VenueRepairRequest, VenueUsageRecord

admin.site.register(Venue)
admin.site.register(VenueInspectionRecord)
admin.site.register(VenueRepairRequest)
admin.site.register(VenueUsageRecord)