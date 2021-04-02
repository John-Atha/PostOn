from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

from django.db.models.query_utils import PathInfo

class Country(models.Model):
    title = models.CharField(max_length=128, null=False)
    code = models.CharField(max_length=10, null=False)

    def __str__(self):
        return f"{self.title}, {self.code}"
    
    def serialize(self):
        return{
            "id": self.id,
            "title": self.title, 
            "code": self.code,
        }

class User(AbstractUser):
    photo = models.ImageField(default="", null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True)
    moto = models.TextField(null = True, blank=True)

    def __str__(self):
        return f"{self.username}, {self.email}, {self.moto}, {self.country}"

    def serialize(self, path=""):
        if self.photo:
            photoVal = path+self.photo.url
        else:
            photoVal = path+'/media/user-icon.png'
        if self.country:
            country1 = self.country.serialize()
        else:
            country1 = None
        return{
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "moto": self.moto,
            "photo": photoVal,
            "country": country1,
        }

class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts", null=False)
    media = models.ImageField(default="", null=True, blank=True)
    text = models.TextField()
    date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"{self.owner}, {self.text}, {self.date}"

    def serialize(self, path=""):
        if self.media:
            photoVal = path+self.media.url
        else:
            photoVal = None

        return {
            "id": self.id,
            "owner": self.owner.serialize(path),
            "media": photoVal,
            "text": self.text,
            "date": self.date,
        }

class Comment(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments", null=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments", null=False)
    text = models.TextField()
    date = models.DateTimeField(default=datetime.now)
    seen = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.owner}, {self.post}, {self.text}, {self.date}"

    def serialize(self, path=""):
        return {
            "id": self.id,
            "owner": self.owner.serialize(path),
            "post": self.post.serialize(path),
            "text": self.text,
            "date": self.date,
            "seen": self.seen,
        } 

class Like(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes", null=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes", null=False)
    date = models.DateTimeField(default=datetime.now)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.owner}, {self.post}, {self.date}"

    def serialize(self, path=""):
        return {
            "id": self.id,
            "owner": self.owner.serialize(path),
            "post": self.post.serialize(path),
            "date": self.date,
            "seen": self.seen,
        } 

class LikeComment(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked_comments", null=False)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes", null=False)
    date = models.DateTimeField(default=datetime.now)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.owner}, {self.comment}, {self.date}"

    def serialize(self, path=""):
        return {
            "id": self.id,
            "owner": self.owner.serialize(path),
            "comment": self.comment.serialize(path),
            "date": self.date,
            "seen": self.seen,
        } 

class Follow(models.Model):
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follows", null=False)
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers", null=False)
    date = models.DateTimeField(default=datetime.now)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.following}, {self.followed}, {self.date}"

    def serialize(self, path=""):
        return {
            "id": self.id,
            "following": self.following.serialize(path),
            "followed": self.followed.serialize(path),
            "date": self.date,
            "seen": self.seen,
        } 