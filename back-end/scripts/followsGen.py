import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*

import random

allUsers = User.objects.all()

for user in allUsers:
    for i in range(1, random.randrange(50)):
        if (random.randrange(10)>2):
            user2 = random.choice(allUsers)
            if (user!=user2):
                follow = Follow(following=user, followed=user2)
                follow.save()