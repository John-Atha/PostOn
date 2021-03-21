import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*

import random

likes = Like.objects.all()
comments = Comment.objects.all()
likescomments = LikeComment.objects.all()
follows = Follow.objects.all()

for like in likes:
    if random.randrange(10)>4:
        like.seen=True
        like.save()
for comment in comments:
    if random.randrange(10)>4:
        comment.seen=True
        comment.save()
for likeComment in likescomments:
    if random.randrange(10)>4:
        likeComment.seen=True
        likeComment.save()
for follow in follows:
    if random.randrange(10)>4:
        follow.seen=True
        follow.save()