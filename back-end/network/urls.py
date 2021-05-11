from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
urlpatterns = [
    path('poston/api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('poston/api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('poston/api/token/verify', TokenVerifyView.as_view(), name='token_verify'),
    path("poston/api/logged", views.isLogged, name="isLogged"),
    path("poston/api/login", views.login_view, name="login"),
    path("poston/api/logout", views.logout_view, name="logout"),
    path("poston/api/register", views.register, name="register"),
    path("poston/api/users", views.AllUsers, name="AllUsers"),
    path("poston/api/users/<int:id>", views.OneUser, name="OneUser"),
    path("poston/api/users/name/<str:username>", views.OneUserName, name="OneUserName"),
    path("poston/api/users/<int:id>/mod", views.OneUserMod, name="OneUserMod"),
    path("poston/api/users/<int:id>/posts", views.UserPosts, name="UserPosts"),
    path("poston/api/users/<int:id>/follows", views.UserFollows, name="UserFollows"),
    path("poston/api/users/<int:id>/follows/count", views.UserFollowsCount, name="UserFollowsCount"),
    path("poston/api/users/<int:id>/followers", views.UserFollowers, name="UserFollowers"),
    path("poston/api/users/<int:id>/followers/count", views.UserFollowersCount, name="UserFollowersCount"),
    path("poston/api/users/<int:id>/follows/posts", views.UserFollowsPosts, name="UserFollowsPosts"),
    path("poston/api/users/<int:id>/likes", views.UserLikes, name="UserLikes"),
    path("poston/api/users/<int:id>/likes/posts/<int:id2>", views.UserLikesPost, name="UserLikesPost"),
    path("poston/api/users/<int:id>/likes/comments/<int:id2>", views.UserLikesComment, name="UserLikesComment"),
    path("poston/api/users/<int:id>/liked", views.UserLiked, name="UserLiked"),
    path("poston/api/users/<int:id>/comments", views.UserComments, name="UserComments"),
    path("poston/api/users/<int:id>/commented", views.UserCommented, name="UserCommented"),
    path("poston/api/users/<int:id>/likescomments", views.UserLikesComments, name="UserLikesComments"),
    path("poston/api/users/<int:id>/likedcomments", views.UserLikedComments, name="UserLikedComments"),
    path("poston/api/users/<int:id>/activity", views.UserActivity, name="UserActivity"),
    path("poston/api/users/<int:id>/notifications", views.UserNotifications, name="UserNotifications"),
    path("poston/api/users/<int:id>/allread", views.UserAllAsRead, name="UserAllAsRead"),
    path("poston/api/users/<int:id>/stats/likes/monthly", views.UsersMonthlyLikesStats, name="UsersMonthlyLikesStats"),
    path("poston/api/users/<int:id>/stats/likes/daily", views.UsersDailyLikesStats, name="UsersDailyLikesStats"),
    path("poston/api/users/<int:id>/stats/comments/monthly", views.UsersMonthlyCommentsStats, name="UsersMonthlyCommentsStats"),
    path("poston/api/users/<int:id>/stats/comments/daily", views.UsersDailyCommentsStats, name="UsersDailyCommentsStats"),
    path("poston/api/users/<int:id>/stats/posts/monthly", views.UsersMonthlyPostsStats, name="UsersMonthlyPostsStats"),
    path("poston/api/users/<int:id>/stats/posts/daily", views.UsersDailyPostsStats, name="UsersDailyPostsStats"),
    path("poston/api/users/<int:id>/stats/follows/monthly", views.UsersMonthlyFollowsStats, name="UsersMonthlyFollowsStats"),
    path("poston/api/users/<int:id>/stats/follows/daily", views.UsersDailyFollowsStats, name="UsersDailyFollowsStats"),
    path("poston/api/countries", views.AllCountries, name="AllCountries"),
    path("poston/api/countries/<int:id>", views.OneCountry, name="OneCountry"),
    path("poston/api/posts", views.AllPosts, name="AllPosts"),
    path("poston/api/posts/mod", views.AllPostsMod, name="AllPostsMod"),
    path("poston/api/posts/<int:id>", views.OnePost, name="OnePost"),
    path("poston/api/posts/<int:id>/mod", views.OnePostMod, name="OnePostMod"),
    path("poston/api/posts/<int:id>/likes-<str:kind>", views.OnePostLikes, name="OnePostLikes"),
    path("poston/api/posts/<int:id>/likes/sample", views.OnePostLikesSample, name="OnePostLikesSample"),
    path("poston/api/posts/<int:id>/comments", views.OnePostComments, name="OnePostComments"),
    path("poston/api/posts/<int:id>/comments/sample", views.OnePostCommentsSample, name="OnePostCommentsSample"),
    path("poston/api/follows", views.AllFollows, name="AllFollows"),
    path("poston/api/follows/mod", views.AllFollowsMod, name="AllFollowsMod"),
    path("poston/api/follows/<int:id>", views.OneFollow, name="OneFollow"),
    path("poston/api/follows/<int:id>/mod", views.OneFollowMod, name="OneFollowMod"),
    path("poston/api/likes", views.AllLikes, name="AllLikes"),
    path("poston/api/likes/mod", views.AllLikesMod, name="AllLikesMod"),
    path("poston/api/likes/<int:id>", views.OneLike, name="OneLike"),
    path("poston/api/likes/<int:id>/mod", views.OneLikeMod, name="OneLikeMod"),
    path("poston/api/comments", views.AllComments, name="allComments"),
    path("poston/api/comments/mod", views.AllCommentsMod, name="allCommentsMod"),
    path("poston/api/comments/<int:id>", views.OneComment, name="OneComment"),
    path("poston/api/comments/<int:id>/mod", views.OneCommentMod, name="OneCommentMod"),
    path("poston/api/comments/<int:id>/likes", views.OneCommentLikes, name="OneCommentLikes"),
    path("poston/api/comments/<int:id>/likes/sample", views.OneCommentLikesSample, name="OneCommentLikesSample"),
    path("poston/api/likecomments", views.AllLikeComments, name="AllLikeComments"),
    path("poston/api/likecomments/mod", views.AllLikeCommentsMod, name="AllLikeCommentsMod"),
    path("poston/api/likecomments/<int:id>", views.OneLikeComment, name="OneLikeComment"),
    path("poston/api/likecomments/<int:id>/mod", views.OneLikeCommentMod, name="OneLikeCommentMod"),
    path("poston/api/stats/likes/monthly", views.MonthlyLikesStats, name="MonthlyLikesStats"),
    path("poston/api/stats/likes/daily", views.DailyLikesStats, name="DailyLikesStats"),
    path("poston/api/stats/comments/monthly", views.MonthlyCommentsStats, name="MonthlyCommentsStats"),
    path("poston/api/stats/comments/daily", views.DailyCommentsStats, name="DailyCommentsStats"),
    path("poston/api/stats/posts/monthly", views.MonthlyPostsStats, name="MonthlyPostsStats"),
    path("poston/api/stats/posts/daily", views.DailyPostsStats, name="DailyPostsStats"),
    path("poston/api/stats/follows/monthly", views.MonthlyFollowsStats, name="MonthlyFollowsStats"),
    path("poston/api/stats/follows/daily", views.DailyFollowsStats, name="DailyFollowsStats"),
    path("poston/api/stats/likecomments/monthly", views.MonthlyLikeCommentsStats, name="MonthlyLikeCommentsStats"),
    path("poston/api/stats/likecomments/daily", views.DailyLikeCommentsStats, name="DailyLikeCommentsStats"),
    path("poston/api/users/<int:id>/photo/mod", views.UserPostPhoto, name="UserPostPhoto"),
    path("poston/api/posts/<int:id>/photo/mod", views.PostPostPhoto, name="PostPostPhoto"),
    path("poston/api/posts/<int:id>/mentions/add", views.PostPostMentions, name="PostPostMentions"),
    path("poston/api/comments/<int:id>/mentions/add", views.PostCommentMentions, name="PostCommentMentions"),
    path("poston/api/posts/<int:id>/mentions/del", views.DeletePostMentions, name="DeletePostMentions"),
    path("poston/api/comments/<int:id>/mentions/del", views.DeleteCommentMentions, name="DeleteCommentMentions"),
    path("poston/api/posts_mentions/<int:id>/mod", views.PutPostMentions, name="PutPostMentions"),
    path("poston/api/comments_mentions/<int:id>/mod", views.PutCommentMentions, name="PutCommentMentions"),
]