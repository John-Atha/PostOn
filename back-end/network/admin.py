from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    pass
class PostAdmin(admin.ModelAdmin):
    pass
class CommentAdmin(admin.ModelAdmin):
    pass
class LikeCommentAdmin(admin.ModelAdmin):
    pass
class LikeAdmin(admin.ModelAdmin):
    pass
class FollowAdmin(admin.ModelAdmin):
    pass
class CountryAdmin(admin.ModelAdmin):
    pass

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(LikeComment, LikeCommentAdmin)
admin.site.register(Like, LikeAdmin)
admin.site.register(Follow, FollowAdmin)
admin.site.register(Country, CountryAdmin)
