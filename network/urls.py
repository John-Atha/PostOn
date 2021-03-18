
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("users", views.AllUsers, name="AllUsers"),
    path("users/<int:id>", views.OneUser, name="OneUser"),
    path("users/<int:id>/follows", views.UserFollows, name="UserFollows"),
    path("users/<int:id>/followers", views.UserFollowers, name="UserFollowers"),
    path("countries", views.AllCountries, name="AllCountries"),
    path("countries/<int:id>", views.OneCountry, name="OneCountry"),
    path("posts", views.AllPosts, name="AllPosts"),
    path("posts/<int:id>", views.OnePost, name="OnePost"),
    path("follows", views.AllFollows, name="AllFollows"),
    path("follows/<int:id>", views.OneFollow, name="OneFollow"),
    
]
