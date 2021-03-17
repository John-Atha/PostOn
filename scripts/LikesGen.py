import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*

import random

allUsers = User.objects.all()
allPosts = Post.objects.all()

for post in allPosts:
    for i in range(1, random.randrange(50)):
        if (random.randrange(10)>2):
            like = Like(owner=random.choice(allUsers), post=post)
            like.save()