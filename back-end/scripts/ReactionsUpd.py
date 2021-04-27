kinds = [ 'like', 'dislike', 'sad', 'haha', 'love', 'liquid']

import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*
import random

likes = Like.objects.all()

for like in likes:
    like.kind=random.choice(kinds)
    like.save()