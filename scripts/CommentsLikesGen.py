import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*

import random

allUsers = User.objects.all()
allComments = Comment.objects.all()

for comment in allComments:
    for i in range(1, random.randrange(5)):
        if (random.randrange(10)>7):
            like = LikeComment(owner=random.choice(allUsers), comment=comment)
            like.save()