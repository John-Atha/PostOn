import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*
import random

posts = Post.objects.all()
users = list(User.objects.all())

for post in posts:
    if random.randrange(10)>6:
        user = random.choice(users)
        if user.photo:
            post.media=user.photo
            post.save()