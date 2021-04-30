from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "last_time", "verified", "followers", "follows")
    def followers(self, obj:User):
        return f"{obj.followers.count()}"
    def follows(self, obj:User):
        return f"{obj.follows.count()}"
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "post_text", "post_media", "post_owner_name", "post_owner_id")
    def post_text(self, obj:Post):
        if obj.text:
            return f"{obj.text}"
        else:
            return '-'
    def post_media(self, obj:Post):
        if obj.media:
            return f"{obj.media}"
        else:
            return '-'
    def post_owner_name(self, obj:Post):
        return obj.owner.username
    def post_owner_id(self, obj:Post):
        return obj.owner.id

class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "comment_owner", "comment_text", "comment_post_id")
    def comment_owner(self, obj:Comment):
        return f"{obj.owner.username}"
    def comment_text(self, obj:Comment):
        return f"{obj.text[:15]+'...'}"
    def comment_post_id(self, obj:Comment):
        return f"{obj.post.id}"

class LikeCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "like_owner", "comment_text", "comment_owner", "post_id")
    def like_owner(self, obj:LikeComment):
        return f"{obj.owner.username}"
    def comment_owner(self, obj:LikeComment):
        return f"{obj.comment.owner.username}"
    def comment_text(self, obj:LikeComment):
        return f"{obj.comment.text[:15]+'...'}"
    def post_id(self, obj:LikeComment):
        return f"{obj.comment.post.id}"

class LikeAdmin(admin.ModelAdmin):
    list_display = ("id", "owner_name", "post_id", "post_text", "post_media", "post_owner")
    def owner_name(self, obj:Like):
        return f"{obj.owner.username}"
    def post_id(self, obj:Like):
        return f"{obj.post.id}"
    def post_text(self, obj:Like):
        if obj.post.text:
            return f"{obj.post.text}"
        else:
            return '-'
    def post_media(self, obj:Like):
        if obj.post.media:
            return  f"{obj.post.media}"
        else:
            return '-'
    def post_owner(self, obj:Like):
        return f"{obj.post.owner.username}"

class FollowAdmin(admin.ModelAdmin):
    list_display = ("id", "following_username", "following_id", "followed_username", "followed_id")
    def following_id(self, obj:Follow):
        return f"{obj.following.id}"
    def following_username(self, obj:Follow):
        return f"{obj.following.username}"
    def followed_id(self, obj:Follow):
        return f"{obj.followed.id}"
    def followed_username(self, obj:Follow):
        return f"{obj.followed.username}"

class CountryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "code")

class PostMentionAdmin(admin.ModelAdmin):
    list_display = ("id", "owner_id", "owner_username", "mentioned_id", "mentioned_username", "post_id")
    def owner_id(self, obj:PostMention):
        return f"{obj.owner.id}"
    def owner_username(self, obj:PostMention):
        return f"{obj.owner.username}"
    def mentioned_id(self, obj:PostMention):
        return f"{obj.mentioned.id}"
    def mentioned_username(self, obj:PostMention):
        return f"{obj.mentioned.username}"
    def post_id(self, obj:PostMention):
        return f"{obj.post.id}"

class CommentMentionAdmin(admin.ModelAdmin):
    list_display = ("id", "owner_id", "owner_username", "mentioned_id", "mentioned_username", "comment_id")
    def owner_id(self, obj:CommentMention):
        return f"{obj.owner.id}"
    def owner_username(self, obj:CommentMention):
        return f"{obj.owner.username}"
    def mentioned_id(self, obj:CommentMention):
        return f"{obj.mentioned.id}"
    def mentioned_username(self, obj:CommentMention):
        return f"{obj.mentioned.username}"
    def post_id(self, obj:CommentMention):
        return f"{obj.comment.id}"

admin.site.register(CommentMention, CommentMentionAdmin)
admin.site.register(PostMention, PostMentionAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(LikeComment, LikeCommentAdmin)
admin.site.register(Like, LikeAdmin)
admin.site.register(Follow, FollowAdmin)
admin.site.register(Country, CountryAdmin)
