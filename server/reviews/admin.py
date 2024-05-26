from django.contrib import admin

# Register your models here.

from .models import Review, ReviewStage

admin.site.register(Review)
admin.site.register(ReviewStage)
