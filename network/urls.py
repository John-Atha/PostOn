
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("Jwitter/api/users", views.AllUsers, name="AllUsers"),
    path("Jwitter/api/users/<int:id>", views.OneUser, name="OneUser"),
    path("Jwitter/api/users/<int:id>/posts", views.UserPosts, name="UserPosts"),
    path("Jwitter/api/users/<int:id>/follows", views.UserFollows, name="UserFollows"),
    path("Jwitter/api/users/<int:id>/followers", views.UserFollowers, name="UserFollowers"),
    path("Jwitter/api/users/<int:id>/likes", views.UserLikes, name="UserLikes"),
    path("Jwitter/api/users/<int:id>/liked", views.UserLiked, name="UserLiked"),
    path("Jwitter/api/users/<int:id>/comments", views.UserComments, name="UserComments"),
    path("Jwitter/api/users/<int:id>/commented", views.UserCommented, name="UserCommented"),
    path("Jwitter/api/users/<int:id>/likescomments", views.UserLikesComments, name="UserLikesComments"),
    path("Jwitter/api/users/<int:id>/likedcomments", views.UserLikedComments, name="UserLikedComments"),
    path("Jwitter/api/users/<int:id>/activity", views.UserActivity, name="UserActivity"),
    path("Jwitter/api/users/<int:id>/notifications", views.UserNotifications, name="UserNotifications"),
    path("Jwitter/api/countries", views.AllCountries, name="AllCountries"),
    path("Jwitter/api/countries/<int:id>", views.OneCountry, name="OneCountry"),
    path("Jwitter/api/posts", views.AllPosts, name="AllPosts"),
    path("Jwitter/api/posts/<int:id>", views.OnePost, name="OnePost"),
    path("Jwitter/api/follows", views.AllFollows, name="AllFollows"),
    path("Jwitter/api/follows/<int:id>", views.OneFollow, name="OneFollow"),
    path("Jwitter/api/likes", views.AllLikes, name="AllLikes"),
    path("Jwitter/api/likes/<int:id>", views.OneLike, name="OneLike"),
    path("Jwitter/api/comments", views.AllComments, name="allComments"),
    path("Jwitter/api/comments/<int:id>", views.OneComment, name="OneComment"),
    path("Jwitter/api/likecomments", views.AllLikeComments, name="AllLikeComments"),
    path("Jwitter/api/likecomments/<int:id>", views.OneLikeComment, name="OneLikeComment"),
]
