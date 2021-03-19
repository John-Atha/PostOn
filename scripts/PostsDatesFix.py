import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*
from datetime import datetime
import random

posts = Post.objects.all()


for post in posts:
    rand = random.randrange(1, 21)
    day=random.randrange(1, 28)
    if rand<3:
        pass
    elif 3<=rand<=5:
        post.date=datetime(2020, 10, day)
    elif 6<=rand<=8:
        post.date=datetime(2020, 11, day)
    elif 9<=rand<=11:
        post.date=datetime(2020, 12, day)
    elif 12<=rand<=14:
        post.date=datetime(2021, 1, day)
    elif 15<=rand<=17:
        post.date=datetime(2021, 2, day)
    elif 18<=rand<=20:
        post.date=datetime(2021, 3, day)
    if rand>=3:
        post.save()