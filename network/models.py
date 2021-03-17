from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

class Country(models.Model):
    title = models.CharField(max_length=128, null=False)
    continent_code = models.CharField(max_length="10", null=False)

    def __str__(self):
        return f"{self.title}, {self.continent_code}"

class User(AbstractUser):
    photo = models.ImageField(default="", null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.username}, {self.country}"

class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts", null=False)
    media = models.ImageField(default="", null=True, blank=True)
    text = models.TextField()
    date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"{self.owner}, {self.text}, {self.date}"

class Comment(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments", null=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments", null=False)
    text = models.TextField()
    date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"{self.owner}, {self.post}, {self.text}, {self.date}"


class Like(models.Model):
    owner = models.Foreignkey(User, on_delete=models.CASCADE, related_name="likes", null=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes", null=False)
    date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"{self.owner}, {self.post}, {self.date}"

class LikeComment(models.Model):
    owner = models.Foreignkey(User, on_delete=models.CASCADE, related_name="liked_comments", null=False)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes", null=False)
    date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"{self.owner}, {self.comment}, {self.date}"


class Follow(models.Model):
    following = models.Foreignkey(User, on_delete=models.CASCADE, related_nam="follows", null=False)
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers", null=False)
    date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"{self.following}, {self.followed}, {self.date}"
