import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*

import random

def randText():
    chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', ',']
    text = ""
    for i in range(random.randrange(1,20)):
        text = text + random.choice(chars) 
    return text

allUsers = User.objects.all()
allPosts = Post.objects.all()

for post in allPosts:
    for i in range(1, 5):
        if (random.randrange(10)>2):
            comm = Comment(owner=random.choice(allUsers), post=post, text=randText())
            comm.save()