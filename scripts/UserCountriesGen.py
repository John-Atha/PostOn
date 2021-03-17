import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*

import random

allUsers = User.objects.all()
allCountries = Country.objects.all()

for user in allUsers[:7]:
    user.country = allCountries[172]   # greece ...
    user.save()

for user in allUsers[7:]:
    user.country = random.choice(allCountries)
    user.save()