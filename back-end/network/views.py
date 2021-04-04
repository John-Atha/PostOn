import json
from itertools import chain
from operator import attrgetter
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse, FileResponse
from rest_framework.decorators import api_view
from .models import *
from datetime import datetime
import imghdr
from base64 import decodestring

def paginate(start, end, items):
    if start is not None:
        try:
            start = int(start)
            if start<1:
                return JsonResponse({"error": "Bad start parameter given"}, status=400)
            items = items[start-1:]
            if end is not None:
                try:
                    end = int(end)
                    if end<start:
                        return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                    items = items[:end-start+1]
                except ValueError:
                    return JsonResponse({"error": "Bad end parameter given"}, status=400)
        except ValueError:
            return JsonResponse({"error": "Bad start parameter given"}, status=400)
    return items

def monthStatsExport(items, keyword):
        stats = []
        prevYearMonth = str(items[0].date).split('-')[0]+'-'+str(items[0].date).split('-')[1]
        counter = -1
        for item in items:
            try:
                date = str(item.date).split('-')
                yearMonth = date[0]+'-'+date[1]
                if yearMonth!=prevYearMonth and prevYearMonth!='':
                    stats.append(
                        {
                            "year-month": prevYearMonth,
                            keyword: counter
                        }
                    )
                    counter=0
                    prevYearMonth = yearMonth
                elif prevYearMonth=="":
                    counter=0
                    prevYearMonth = yearMonth
                else:
                    counter = counter+1
            except Exception:
                pass
        stats.append(
            {
                "year-month": prevYearMonth,
                keyword: counter
            }
        )
        return stats

def dailyStatsExport(items):
        result = {
            "Monday": 0,
            "Tuesday": 0, 
            "Wednesday": 0, 
            "Thursday": 0, 
            "Friday": 0, 
            "Saturday": 0, 
            "Sunday": 0
        }
        for item in items:
            s = str(item.date).split(' ')[0].split('-')
            day = datetime(int(s[0]), int(s[1]), int(s[2])).strftime("%A")
            result[day] = result[day]+1
        return result

@api_view(['Get'])
def isLogged(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        if request.user.is_authenticated:
            return JsonResponse({"authenticated": True, "id": request.user.id}, status=200)
        else:
            return JsonResponse({"authenticated": False}, status=401)

def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"}, status=200)

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return JsonResponse({"error": "Passwords are different"}, status=400)

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return JsonResponse({"error": "Username already taken"}, status=400)
        login(request, user)
        return JsonResponse({"message": "Registered successfully", "id": user.id}, status=200)
    else:
        return JsonResponse({"error": "Only POST method is allowed"}, status=400)

def OneUser(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({"error": f"Invalid user id ({id})."}, status=400)   
        return JsonResponse(user.serialize(request.build_absolute_uri('/')[:-1]))

@api_view(['Get', 'Put'])
def OneUserMod(request, id):
    if request.method!="PUT":
        return JsonResponse({"error": "Only PUT method is allowed."}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({"error": f"Invalid user id ({id})."}, status=400) 
        #if JWTAuthentication.authenticate(self, request) is not None:
        if request.user==user:
            #if request.user.is_authenticated:
            smthNew = False
            data = json.loads(request.body)
            #if request.PUT["photo"] is not None:
            #    smthNew = True
            #    user.photo = request.PUT["photo"]
            #else:
            if data.get("username") is not None:  
                user.username = data["username"]
                smthNew = True
            if data.get("moto") is not None:
                user.moto = data["moto"]
                smthNew = True
            if smthNew:
                try:
                    user.save()
                    return JsonResponse(user.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                except:
                    return JsonResponse({"error": "Username probably already exists"} , status=400)
            else:
                return JsonResponse({"error": "Give new username and/or moto field"} , status=400)                
            #else:
            #    return JsonResponse({"error": "Authentication required"}, status=401)
        else:
            return JsonResponse({"error": "Only the owner of the profile can update it"}, status=401)

def AllUsers(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)
    else:
        users = User.objects.all()
        result = paginate(request.GET.get("start"), request.GET.get("end"), users)
        try:
            users = result
            if len(users)==0:
                return JsonResponse({"error": "No users found."}, status=402)
            else:
                return JsonResponse([user.serialize(request.build_absolute_uri('/')[:-1]) for user in users], safe=False, status=200)
        except TypeError:
            return result

def OneCountry(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)
    else:
        try:
            country = Country.objects.get(id=id)
        except Country.DoesNotExist:
            return JsonResponse({"error": f"Invalid country id ({id})."}, status=400) 
        if request.method=="GET":
            return JsonResponse(country.serialize(), status=200)

def AllCountries(request):
    if request.method=="GET":
        countries = Country.objects.all()
        result = paginate(request.GET.get("start"), request.GET.get("end"), countries)
        try:
            countries = result
            if len(countries)==0:
                return JsonResponse({"error": "No countries found."}, status=402)
            else:
                return JsonResponse([country.serialize() for country in countries], safe=False, status=200)
        except TypeError:
            return result
    else:
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)

def OnePost(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)
    else:
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": f"Invalid post id ({id})."}, status=400)
        return(JsonResponse(post.serialize(request.build_absolute_uri('/')[:-1]), status=200))

@api_view(['Put', 'Delete'])
def OnePostMod(request, id):
    if request.method!="PUT" and request.method!="DELETE":
        return JsonResponse({"error": "Only PUT and DEL methods are allowed."}, status=400)
    else:
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": f"Invalid post id ({id})."}, status=400)
        if request.method=="PUT":
            if request.user.is_authenticated:
                if request.user==post.owner:
                    data = json.loads(request.body)
                    if data.get("text") is not None:
                        if post.text!=data["text"]:
                            post.text = data["text"]
                            post.date = str(datetime.now())
                            post.save()
                            return JsonResponse(post.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                else:
                    return JsonResponse({"error": "Only the post's owner can modify it"}, status=400)
            else:
                return JsonResponse({"error": "Authentication required"}, status=401) 
        elif request.method=="DELETE":
            if request.user.is_authenticated:
                if request.user==post.owner:
                    post.delete()
                    return JsonResponse({"message": "Post deleted successfully"}, status=200)
                else:
                    return JsonResponse({"error": "Only the post's owner can delete it"}, status=400)
            else:
                return JsonResponse({"error": "Authentication required"}, status=401) 

def UserPosts(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            posts = user.posts.all().order_by('-date')
            if request.GET.get("start"):
                try:
                    start = int(request.GET.get("start"))
                    if start<1:
                        return JsonResponse({"error": "Bad start parameter given"}, status=400)
                    posts = posts[start-1:]
                    if request.GET.get("end"):
                        try:
                            end = int(request.GET.get("end"))
                            if end<start:
                                return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                            posts = posts[:end-start+1]
                        except ValueError:
                            return JsonResponse({"error": "Bad end parameter given"}, status=400)
                except ValueError:
                    return JsonResponse({"error": "Bad start parameter given"}, status=400)
            if len(posts)==0:
                return JsonResponse({"error": "No posts found for this user"}, status=402)
            else:
                return JsonResponse([post.serialize(request.build_absolute_uri('/')[:-1]) for post in posts], safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

def AllPosts(request):
    if request.method=="GET": 
        posts = Post.objects.order_by('-date')
        result = paginate(request.GET.get("start"), request.GET.get("end"), posts)
        try:
            posts = result
            if len(posts)==0:
                return JsonResponse({"error": "No posts found."}, status=402)
            else:
                return JsonResponse([post.serialize(request.build_absolute_uri('/')[:-1]) for post in posts], safe=False, status=200)
        except TypeError:
            return result
    else:
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)

@api_view(['Post'])
def AllPostsMod(request):
    if request.method=="POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            if data.get("owner") is not None:
                if data.get("owner").get("id") is not None:
                    ownId = data["owner"]["id"]
                    try:
                        owner = User.objects.get(id=ownId)
                        if request.user==owner:
                            if data.get("text") is not None:
                                #if len(str(data["text"])):
                                post = Post(owner=owner, text=str(data["text"]))
                                post.save()
                                return JsonResponse(post.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                                #else:
                                #    return JsonResponse({"error": "No text given."}, status=400)   
                            else:
                                return JsonResponse({"error": "No text given."}, status=400)  
                        else:
                            return JsonResponse({"error": "You cannot post on behalf of another user"}, status=400)      
                    except User.DoesNotExist:
                        return JsonResponse({"error": "Bad owner given."}, status=400)        
                else:
                    return JsonResponse({"error": "Bad owner given."}, status=400)
            else:
                return JsonResponse({"error": "No owner given."}, status=400)       
        else:
            return JsonResponse({"error": "Authentication required"}, status=401) 
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=400)

def AllFollows(request):
    if request.method=="GET":
        AllFollows = Follow.objects.order_by('-date')
        result = paginate(request.GET.get("start"), request.GET.get("end"), AllFollows)
        try:
            AllFollows = result
            if len(AllFollows)==0:
                return JsonResponse({"error": "No follows found"}, status=402)
            else:
                return JsonResponse([follow.serialize(request.build_absolute_uri('/')[:-1]) for follow in AllFollows], safe=False, status=200)
        except TypeError:
            return result
    else:
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)

@api_view(['Post'])
def AllFollowsMod(request):
    if request.method=="POST":
        data = json.loads(request.body)
        if data.get("following") is not None:
            if data.get("following").get("id") is not None:
                try:
                    following = User.objects.get(id=data["following"]["id"])
                    if request.user==following:
                        if data.get("followed") is not None:
                            if data.get("followed").get("id") is not None:
                                try:
                                    followed = User.objects.get(id=data["followed"]["id"])
                                    if followed!=following:
                                        follow = Follow(following=following, followed=followed)
                                        follow.save()
                                        return JsonResponse(follow.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                                    else:
                                        return JsonResponse({"error": "A user cannot follow his/her self"}, status=400)
                                except User.DoesNotExist:
                                    return JsonResponse({"error": "Invalid followed id"}, status=400)
                            else:
                                return JsonResponse({"error": "Invalid followed user given"}, status=400)
                        else:
                            return JsonResponse({"error": "Invalid followed user given"}, status=400)
                    else:
                        return JsonResponse({"error": "You cannot follow someone on behalf of another user"}, status=400)
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid follower id"}, status=400)
            else:
                return JsonResponse({"error": "Invalid follower user given"}, status=400)
        else:
            return JsonResponse({"error": "Invalid follower user given"}, status=400)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=400)

def OneFollow(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)
    else:
        try:
            follow = Follow.objects.get(id=id)
        except Follow.DoesNotExist:
            return JsonResponse({"error": "Invalid follow id"}, status=400)
        if request.method=="GET":
            return JsonResponse(follow.serialize(request.build_absolute_uri('/')[:-1]), status=200)

@api_view(['Delete', 'Put']) 
def OneFollowMod(request, id):
    if request.method!="DELETE" and request.method!="PUT":
        return JsonResponse({"error": "Only PUT and DEL methods are allowed."}, status=400)
    else:
        try:
            follow = Follow.objects.get(id=id)
        except Follow.DoesNotExist:
            return JsonResponse({"error": "Invalid follow id"}, status=400)
        if request.method=="DELETE":
            if request.user==follow.following:
                follow.delete()
                return JsonResponse({"message": "Follow deleted successfully"}, status=200)
            else:
                return JsonResponse({"error": "Only the follower can delete the follow"}, status=400)
        elif request.method=="PUT":
            if request.user==follow.followed:
                data = json.loads(request.body)
                if data.get("seen") is not None:
                    if data["seen"]==True or data["seen"]==False:
                        follow.seen=data["seen"]
                        follow.save()
                        return JsonResponse(follow.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                    else:
                        return JsonResponse({"error": "'seen' field can have only True/False value"}, status=400)
                else:
                    print(data.get("seen"))
                    return JsonResponse({"error": "Only updatable field is the 'seen' field"}, status=400)
            else:
                return JsonResponse({"error": "Only the followed can mark the follow as 'seen'"}, status=400)       
 
def UserFollows(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            follows = user.follows.order_by('-date')
            result = paginate(request.GET.get("start"), request.GET.get("end"), follows)
            try:
                follows = result
                if len(follows)==0:
                    return JsonResponse({"error": "No follows found."}, status=402)
                else:
                    return JsonResponse([follow.serialize(request.build_absolute_uri('/')[:-1]) for follow in follows], safe=False, status=200)
            except TypeError:
                return result
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def UserFollowers(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            follows = user.followers.order_by('-date')
            result = paginate(request.GET.get("start"), request.GET.get("end"), follows)
            try:
                follows = result
                if len(follows)==0:
                    return JsonResponse({"error": "No follows found."}, status=402)
                else:
                    return JsonResponse([follow.serialize(request.build_absolute_uri('/')[:-1]) for follow in follows], safe=False, status=200)
            except TypeError:
                return result
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400) 

def AllLikes(request):
    if request.method=="GET":
        likes = Like.objects.order_by('-date')
        result = paginate(request.GET.get("start"), request.GET.get("end"), likes)
        try:
            likes = result
            if len(likes)==0:
                return JsonResponse({"error": "No likes found."}, status=402)
            else:
                return JsonResponse([like.serialize(request.build_absolute_uri('/')[:-1]) for like in likes], safe=False, status=200)
        except TypeError:
            return result
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

@api_view(['Post'])
def AllLikesMod(request):
    if request.method=="POST":
        data = json.loads(request.body)
        if data.get("owner") is not None:
            if data.get("owner").get("id") is not None:
                try:
                    ownerId = int(data["owner"]["id"])
                except ValueError:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
                try:
                    owner = User.objects.get(id=ownerId)
                    if owner==request.user:
                        if data.get("post") is not None:
                            if data.get("post").get("id") is not None:
                                try:
                                    postId = int(data["post"]["id"])
                                    try:
                                        post = Post.objects.get(id=postId)
                                        like = Like(owner=owner, post=post)
                                        like.save()
                                        return JsonResponse(like.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                                    except Post.DoesNotExist:
                                        return JsonResponse({"error": "Invalid post id."}, status=400)                                
                                except ValueError:
                                    return JsonResponse({"error": "Invalid post id."}, status=400)
                            else:
                                return JsonResponse({"error": "Invalid post id."}, status=400)
                        else:
                            return JsonResponse({"error": "Invalid post given."}, status=400)
                    else:
                        return JsonResponse({"error": "You cannot like a post on behalf of another user"}, status=400)
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
            else:
                return JsonResponse({"error": "Invalid owner id."}, status=400)
        else:
            return JsonResponse({"error": "Invalid owner given."}, status=400)
    else:
        return JsonResponse({"error": "Only POST method is allowed"}, status=400)

def OneLike(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            like= Like.objects.get(id=id)
        except Like.DoesNotExist:
            return JsonResponse({"error": "Invalid like id"}, status=400)
        return JsonResponse(like.serialize(request.build_absolute_uri('/')[:-1]), status=200)

@api_view(['Put', 'Delete'])
def OneLikeMod(request, id):
    if request.method!="DELETE" and request.method!="PUT":
        return JsonResponse({"error": "Only PUT and DEL methods are allowed"}, status=400)
    else:
        try:
            like= Like.objects.get(id=id)
        except Like.DoesNotExist:
            return JsonResponse({"error": "Invalid like id"}, status=400)
        if request.method=="DELETE":
            if request.user==like.owner:
                like.delete()
                return JsonResponse({"message": "Like deleted succesfully"}, status=200)
            else:
                return JsonResponse({"error": "You cannot un-like a post on behalf of another user"}, status=400)
        elif request.method=="PUT":
            if request.user==like.post.owner:
                data = json.loads(request.body)
                if data.get("seen") is not None:
                    if data["seen"]==True or data["seen"]==False:
                        like.seen=data["seen"]
                        like.save()
                        return JsonResponse(like.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                    else:
                        return JsonResponse({"error": "'seen' field can have only True/False value"}, status=400)
                else:
                    print(data.get("seen"))
                    return JsonResponse({"error": "Only updatable field is the 'seen' field"}, status=400)
            else:
                return JsonResponse({"error": "You cannot mark a like us seen/unseen on behalf of another user"}, status=400)

def UserLikes(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            likes = user.likes.all().order_by('-post__date')
            result = paginate(request.GET.get("start"), request.GET.get("end"), likes)
            try:
                likes = result
                if len(likes)==0:
                    return JsonResponse({"error": "No likes found."}, status=402)
                else:
                    return JsonResponse([like.serialize(request.build_absolute_uri('/')[:-1]) for like in likes], safe=False, status=200)
            except TypeError:
                return result
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def UserLiked(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            posts = Post.objects.filter(owner=user)
            likes = Like.objects.filter(post__in=posts)
            result = paginate(request.GET.get("start"), request.GET.get("end"), likes)
            try:
                likes = result
                if len(likes)==0:
                    return JsonResponse({"error": "No likes found."}, status=402)
                else:
                    return JsonResponse([like.serialize(request.build_absolute_uri('/')[:-1]) for like in likes], safe=False, status=200)
            except TypeError:
                return result
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def AllComments(request):
    if request.method=="GET":
        comments = Comment.objects.order_by('-date')
        result = paginate(request.GET.get("start"), request.GET.get("end"), comments)
        try:
            comments = result
            if len(comments)==0:
                return JsonResponse({"error": "No comments found."}, status=402)
            else:
                return JsonResponse([comment.serialize(request.build_absolute_uri('/')[:-1]) for comment in comments], safe=False, status=200)
        except TypeError:
            return result
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

@api_view(['Post'])
def AllCommentsMod(request):
    if request.method=="POST":
        data = json.loads(request.body)
        if data.get("owner") is not None:
            if data.get("owner").get("id") is not None:
                try:
                    ownerId = int(data["owner"]["id"])
                except ValueError:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
                try:
                    owner = User.objects.get(id=ownerId)
                    if request.user==owner:
                        if data.get("post") is not None:
                            if data.get("post").get("id") is not None:
                                try:
                                    postId = int(data["post"]["id"])
                                    try:
                                        post = Post.objects.get(id=postId)
                                        if data.get("text") is not None:
                                            text = data["text"]
                                            if len(text)>0:
                                                comment = Comment(owner=owner, post=post, text=text)
                                                comment.save()
                                                return JsonResponse(comment.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                                            else:
                                                return JsonResponse({"error": "Invalid text given"}, status=400)
                                        else:
                                            return JsonResponse({"error": "Invalid text given"}, status=400)
                                    except Post.DoesNotExist:
                                        return JsonResponse({"error": "Invalid post id."}, status=400)                                
                                except ValueError:
                                    return JsonResponse({"error": "Invalid post id."}, status=400)
                            else:
                                return JsonResponse({"error": "Invalid post id."}, status=400)
                        else:
                            return JsonResponse({"error": "Invalid post given."}, status=400)
                    else:
                        return JsonResponse({"error": "You cannot post a comment on behalf of another user"}, status=400)
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
            else:
                return JsonResponse({"error": "Invalid owner id."}, status=400)
        else:
            return JsonResponse({"error": "Invalid owner given."}, status=400)
    else:
        return JsonResponse({"error": "Only POST method is allowed"}, status=400)

def OneComment(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            comment= Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Invalid comment id"}, status=400)
        return JsonResponse(comment.serialize(request.build_absolute_uri('/')[:-1]), status=200)

@api_view(['Delete', 'Put'])
def OneCommentMod(request, id):
    if request.method!="DELETE" and request.method!="PUT":
        return JsonResponse({"error": "Only PUT and DEL methods are allowed"}, status=400)
    else:
        try:
            comment= Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Invalid comment id"}, status=400)
        if request.method=="DELETE":
            if request.user==comment.owner:
                comment.delete()
                return JsonResponse({"message": "Comment deleted succesfully"}, status=200)
            else:
                return JsonResponse({"error": "You cannot delete a comment on behalf of its owner"}, status=400)
        elif request.method=="PUT":
            if request.user==comment.post.owner:
                data = json.loads(request.body)
                if data.get("seen") is not None:
                    if data["seen"]==True or data["seen"]==False:
                        comment.seen=data["seen"]
                        comment.save()
                        return JsonResponse(comment.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                    else:
                        return JsonResponse({"error": "'seen' field can have only True/False value"}, status=400)
                else:
                    print(data.get("seen"))
                    return JsonResponse({"error": "Only updatable field is the 'seen' field"}, status=400)
            else:
                return JsonResponse({"error": "You cannot mark a comment as seen / not seen on behalf of the post owner"}, status=400)

def UserComments(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            comments = user.comments.order_by('-date')
            result = paginate(request.GET.get("start"), request.GET.get("end"), comments)
            try:
                comments = result
                if len(comments)==0:
                    return JsonResponse({"error": "No comments found."}, status=402)
                else:
                    return JsonResponse([comment.serialize(request.build_absolute_uri('/')[:-1]) for comment in comments], safe=False, status=200)
            except TypeError:
                return result
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def UserCommented(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            posts = Post.objects.filter(owner=user)
            comments = Comment.objects.filter(post__in=posts)
            result = paginate(request.GET.get("start"), request.GET.get("end"), comments)
            try:
                comments = result
                if len(comments)==0:
                    return JsonResponse({"error": "No comments found."}, status=402)
                else:
                    return JsonResponse([comment.serialize(request.build_absolute_uri('/')[:-1]) for comment in comments], safe=False, status=200)
            except TypeError:
                return result
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def AllLikeComments(request):
    if request.method=="GET":
        likeComments = LikeComment.objects.order_by('-date')
        result = paginate(request.GET.get("start"), request.GET.get("end"), likeComments)
        try:
            likeComments = result
            if len(likeComments)==0:
                return JsonResponse({"error": "No likes on comments found."}, status=402)
            else:
                return JsonResponse([likeComment.serialize(request.build_absolute_uri('/')[:-1]) for likeComment in likeComments], safe=False, status=200)
        except TypeError:
            return result
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

@api_view(['Post'])
def AllLikeCommentsMod(request):
    if request.method=="POST":
        data = json.loads(request.body)
        if data.get("owner") is not None:
            if data.get("owner").get("id") is not None:
                try:
                    ownerId = int(data["owner"]["id"])
                except ValueError:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
                try:
                    owner = User.objects.get(id=ownerId)
                    if request.user==owner:
                        if data.get("comment") is not None:
                            if data.get("comment").get("id") is not None:
                                try:
                                    commentId = int(data["comment"]["id"])
                                    try:
                                        comment = Comment.objects.get(id=commentId)
                                        likeComment = LikeComment(owner=owner, comment=comment)
                                        likeComment.save()
                                        return JsonResponse(likeComment.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                                    except Comment.DoesNotExist:
                                        return JsonResponse({"error": "Invalid comment id."}, status=400)                                
                                except ValueError:
                                    return JsonResponse({"error": "Invalid comment id."}, status=400)
                            else:
                                return JsonResponse({"error": "Invalid comment id."}, status=400)
                        else:
                            return JsonResponse({"error": "Invalid comment given."}, status=400)
                    else:
                        return JsonResponse({"error": "You cannot like a comment on behalf of another user"}, status=400)
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
            else:
                return JsonResponse({"error": "Invalid owner id."}, status=400)
        else:
            return JsonResponse({"error": "Invalid owner given."}, status=400)
    else:
        return JsonResponse({"error": "Only POST method is allowed"}, status=400)

def OneLikeComment(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            likeComment= LikeComment.objects.get(id=id)
        except LikeComment.DoesNotExist:
            return JsonResponse({"error": "Invalid like on comment id"}, status=400)
        if request.method=="GET":
            return JsonResponse(likeComment.serialize(request.build_absolute_uri('/')[:-1]), status=200)

@api_view(['Put', 'Delete'])
def OneLikeCommentMod(request, id):
    if request.method!="DELETE" and request.method!="PUT":
        return JsonResponse({"error": "Only PUT and DEL methods are allowed"}, status=400)
    else:
        try:
            likeComment= LikeComment.objects.get(id=id)
        except LikeComment.DoesNotExist:
            return JsonResponse({"error": "Invalid like on comment id"}, status=400)
        if request.user.is_authenticated:
            if request.method=="DELETE":
                if request.user==likeComment.owner:
                    likeComment.delete()
                    return JsonResponse({"message": "Like on comment deleted succesfully"}, status=200)
                else:
                    return JsonResponse({"error": "You cannot un-like a comment on behalf of another user"}, status=400)
            elif request.method=="PUT":
                if request.user==likeComment.comment.owner:

                    data = json.loads(request.body)
                    if data.get("seen") is not None:
                        if data["seen"]==True or data["seen"]==False:
                            likeComment.seen=data["seen"]
                            likeComment.save()
                            return JsonResponse(likeComment.serialize(request.build_absolute_uri('/')[:-1]), status=200)
                        else:
                            return JsonResponse({"error": "'seen' field can have only True/False value"}, status=400)
                    else:
                        print(data.get("seen"))
                        return JsonResponse({"error": "Only updatable field is the 'seen' field"}, status=400)
                else:
                    return JsonResponse({"error": "You cannot mark a comment as seen / not seen on behalf of its writer"}, status=400)
        else:
            return JsonResponse({"error": "Authentication required"}, status=401)

def UserLikesComments(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            likeComments = user.liked_comments.order_by('-date')
            result = paginate(request.GET.get("start"), request.GET.get("end"), likeComments)
            try:
                likeComments = result
                if len(likeComments)==0:
                    return JsonResponse({"error": "No likeComments found."}, status=402)
                else:
                    return JsonResponse([likeComment.serialize(request.build_absolute_uri('/')[:-1]) for likeComment in likeComments], safe=False, status=200)
            except TypeError:
                return result
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def UserLikedComments(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            comments = Comment.objects.filter(owner=user)
            likeComments = LikeComment.objects.filter(comment__in=comments)
            result = paginate(request.GET.get("start"), request.GET.get("end"), likeComments)
            try:
                likeComments = result
                if len(likeComments)==0:
                    return JsonResponse({"error": "No likeComments found."}, status=402)
                else:
                    return JsonResponse([likeComment.serialize(request.build_absolute_uri('/')[:-1]) for likeComment in likeComments], safe=False, status=200)
            except TypeError:
                return result
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

@api_view(['Get'])
def UserActivity(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
        if request.user==user:
            comments = Comment.objects.filter(owner=user)
            likes = Like.objects.filter(owner=user)
            likeComments = LikeComment.objects.filter(owner=user)
            posts = Post.objects.filter(owner=user)
            follows = Follow.objects.filter(following=user)
            activity = sorted(
                chain(comments, likes, likeComments, posts, follows),
                key=attrgetter('date'),
                reverse=True)
            result = paginate(request.GET.get("start"), request.GET.get("end"), activity)
            try:
                activity = result
                if len(activity)==0:
                    return JsonResponse({"error": "No activity found."}, status=402)
                else:
                    return JsonResponse([act.serialize(request.build_absolute_uri('/')[:-1]) for act in activity], safe=False, status=200)
            except TypeError:
                return result
        else:
            return JsonResponse({"error": "You cannot see the activity of another user"}, status=400)

@api_view(['Get'])
def UserNotifications(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
        if request.user==user:
            follows = Follow.objects.filter(followed=user)#.filter(seen=False)
            myComments = Comment.objects.filter(owner=user)
            myPosts = Post.objects.filter(owner=user)
            LikesComments = LikeComment.objects.filter(comment__in=myComments)#.filter(seen=False)
            LikesPosts = Like.objects.filter(post__in=myPosts)#.filter(seen=False)
            CommentsPosts = Comment.objects.filter(post__in=myPosts)#.filter(seen=False)
            notifications = sorted(
                chain(follows, LikesComments, LikesPosts, CommentsPosts),
                key = attrgetter('date'),
                reverse=True)
            result = paginate(request.GET.get("start"), request.GET.get("end"), notifications)
            try:
                notifications = result
                if len(notifications)==0:
                    return JsonResponse({"error": "No notifications found."}, status=402)
                else:
                    return JsonResponse([notification.serialize(request.build_absolute_uri('/')[:-1]) for notification in notifications], safe=False, status=200)
            except TypeError:
                return result
        else:
            return JsonResponse({"error": "You cannot see the notifications of another user"}, status=400)

@api_view(['Put'])
def UserAllAsRead(request, id):
    if request.method!="PUT":
        return JsonResponse({"error": "Only PUT method allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
        if request.user.is_authenticated:
            if request.user==user:
                follows = Follow.objects.filter(followed=user).filter(seen=False)
                myComments = Comment.objects.filter(owner=user)
                myPosts = Post.objects.filter(owner=user)
                LikesComments = LikeComment.objects.filter(comment__in=myComments).filter(seen=False)
                LikesPosts = Like.objects.filter(post__in=myPosts).filter(seen=False)
                CommentsPosts = Comment.objects.filter(post__in=myPosts).filter(seen=False)
                for foll in follows:
                    foll.seen=True
                    foll.save()
                for like in LikesComments:
                    like.seen=True
                    like.save()
                for like in LikesPosts:
                    like.seen=True
                    like.save()
                for comm in CommentsPosts:
                    comm.seen=True
                    comm.save()
                return JsonResponse({"message": "Everything marked as read successfully"}, status=200)
            else:
                return JsonResponse({"error": "You cannot mark as a read another user's notifications"}, status=400)
        else:
            return JsonResponse({"error": "Authentication required"}, status=401)

def MonthlyLikesStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        # for likes
        likes = Like.objects.order_by('date')
        stats = monthStatsExport(likes, "likes")
        if len(stats)==0:
            return JsonResponse({"error": "No likes found"}, status=402)
        return JsonResponse(stats, safe=False, status=200)

def MonthlyCommentsStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        # for comments
        comments = Comment.objects.order_by('date')
        stats = monthStatsExport(comments, "comments")
        if len(stats)==0:
            return JsonResponse({"error": "No comments found"}, status=402)
        return JsonResponse(stats, safe=False, status=200)

def MonthlyPostsStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        posts = Post.objects.order_by('date')
        stats = monthStatsExport(posts, "posts")
        if len(stats)==0:
            return JsonResponse({"error": "No posts found"}, status=402)
        return JsonResponse(stats, safe=False, status=200)

def MonthlyFollowsStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        follows = Follow.objects.order_by('date')
        stats = monthStatsExport(follows, "follows")
        if len(stats)==0:
            return JsonResponse({"error": "No follows found"}, status=402)
        return JsonResponse(stats, safe=False, status=200)

def MonthlyLikeCommentsStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        likeComments = LikeComment.objects.order_by('date')
        stats = monthStatsExport(likeComments, "likesOnComments")
        if len(stats)==0:
            return JsonResponse({"error": "No like found"}, status=402)
        return JsonResponse(stats, safe=False, status=200)

def DailyLikesStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        likes = Like.objects.all()
        likesCount = dailyStatsExport(likes)
        return JsonResponse(likesCount, safe=False, status=200)

def DailyCommentsStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        comments = Comment.objects.all()
        commentsCount = dailyStatsExport(comments)
        return JsonResponse(commentsCount, safe=False, status=200)

def DailyPostsStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        posts = Post.objects.all()
        postsCount = dailyStatsExport(posts)
        return JsonResponse(postsCount, safe=False, status=200)

def DailyFollowsStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        follows = Follow.objects.all()
        followsCount = dailyStatsExport(follows)
        return JsonResponse(followsCount, safe=False, status=200)

def DailyLikeCommentsStats(request):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        likeComments = Follow.objects.all()
        likeCommentsCount = dailyStatsExport(likeComments)
        return JsonResponse(likeCommentsCount, safe=False, status=200)

def OnePostLikes(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Invalid post id."}, status=400)
        likes = Like.objects.filter(post=post).order_by('-date')
        result = paginate(request.GET.get("start"), request.GET.get("end"), likes)
        try:
            likes = result
            if len(likes)==0:
                return JsonResponse({"error": "No likes found."}, status=402)
            else:
                return JsonResponse([like.serialize(request.build_absolute_uri('/')[:-1]) for like in likes], safe=False, status=200)
        except TypeError:
            return result

def OnePostLikesSample(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Invalid post id."}, status=400)
        if request.method=="GET":
            likes = Like.objects.filter(post=post).order_by('-date')       
            if len(likes)==0:
                return JsonResponse({"error": "No likes found for this post"}, status=402)
            else:
                answer = {
                    "likes": len(likes),
                    "one-liker": likes[0].owner.serialize(request.build_absolute_uri('/')[:-1])
                }
                return JsonResponse(answer, status=200)

def OnePostComments(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Invalid post id."}, status=400)
        comments = Comment.objects.filter(post=post).order_by('-date')
        result = paginate(request.GET.get("start"), request.GET.get("end"), comments)
        try:
            comments = result
            if len(comments)==0:
                return JsonResponse({"error": "No comments found."}, status=402)
            else:
                return JsonResponse([comment.serialize(request.build_absolute_uri('/')[:-1]) for comment in comments], safe=False, status=200)
        except TypeError:
            return result

def OnePostCommentsSample(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Invalid post id."}, status=400)
        if request.method=="GET":
            comments = Comment.objects.filter(post=post).order_by('-date')       
            if len(comments)==0:
                return JsonResponse({"error": "No comments found for this post"}, status=402)
            else:
                answer = {
                    "comments": len(comments),
                    "one-comment": comments[0].serialize(request.build_absolute_uri('/')[:-1])
                }
                return JsonResponse(answer, status=200)

def OneCommentLikes(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            comment = Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Invalid comment id."}, status=400)
        likes = LikeComment.objects.filter(comment=comment)
        result = paginate(request.GET.get("start"), request.GET.get("end"), likes)
        try:
            likes = result
            if len(likes)==0:
                return JsonResponse({"error": "No likes found."}, status=402)
            else:
                return JsonResponse([like.serialize(request.build_absolute_uri('/')[:-1]) for like in likes], safe=False, status=200)
        except TypeError:
            return result

def OneCommentLikesSample(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            comment = Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Invalid comment id."}, status=400)
        if request.method=="GET":
            likes = LikeComment.objects.filter(comment=comment)       
            if len(likes)==0:
                return JsonResponse({"error": "No likes found for this comment"}, status=402)
            else:
                answer = {
                    "likes": len(likes),
                    "one-liker": likes[0].owner.serialize(request.build_absolute_uri('/')[:-1])
                }
                return JsonResponse(answer, status=200)

def UserFollowsCount(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            follows = user.follows.count()
            return JsonResponse({"follows": follows}, safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def UserFollowersCount(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            follows = user.followers.count()
            return JsonResponse({"followers": follows}, safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400) 

@api_view(['Get'])
def UserFollowsPosts(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                follows = Follow.objects.filter(following=user)
                userFollows = follows.values_list('followed')
                posts = Post.objects.filter(owner__in=userFollows).order_by('-date')
                result = paginate(request.GET.get("start"), request.GET.get("end"), posts)
                try:
                    posts = result
                    if len(posts)==0:
                        return JsonResponse({"error": "No posts found."}, status=402)
                    else:
                        return JsonResponse([post.serialize(request.build_absolute_uri('/')[:-1]) for post in posts], safe=False, status=200)
                except TypeError:
                    return result   
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)   
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

@api_view(['Get'])
def UsersMonthlyLikesStats(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                likes = Like.objects.filter(owner=user).order_by('date')
                stats = monthStatsExport(likes, "likes")
                if len(stats)==0:
                    return JsonResponse({"error": "No likes found"}, status=402)
                return JsonResponse(stats, safe=False, status=200)
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

@api_view(['Get'])
def UsersDailyLikesStats(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                likes = Like.objects.filter(owner=user)
                likesCount = dailyStatsExport(likes)
                return JsonResponse(likesCount, safe=False, status=200)
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

@api_view(['Get'])
def UsersDailyCommentsStats(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                comments = Comment.objects.filter(owner=user)
                commentsCount = dailyStatsExport(comments)
                return JsonResponse(commentsCount, safe=False, status=200)
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
        
@api_view(['Get'])
def UsersMonthlyCommentsStats(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                comments = Comment.objects.filter(owner=user).order_by('date')
                stats = monthStatsExport(comments, "comments")
                if len(stats)==0:
                    return JsonResponse({"error": "No comments found"}, status=402)
                return JsonResponse(stats, safe=False, status=200)
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

@api_view(['Get'])
def UsersDailyPostsStats(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                posts = Post.objects.filter(owner=user)
                postsCount = dailyStatsExport(posts)
                return JsonResponse(postsCount, safe=False, status=200)
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

@api_view(['Get'])
def UsersMonthlyPostsStats(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                posts = Post.objects.filter(owner=user).order_by('date')
                stats = monthStatsExport(posts, "posts")
                if len(stats)==0:
                    return JsonResponse({"error": "No posts found"}, status=402)
                return JsonResponse(stats, safe=False, status=200)
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

@api_view(['Get'])
def UsersDailyFollowsStats(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                follows = Follow.objects.filter(following=user).all()
                followsCount = dailyStatsExport(follows)
                return JsonResponse(followsCount, safe=False, status=200)
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

@api_view(['Get'])
def UsersMonthlyFollowsStats(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            if request.user==user:
                follows = Follow.objects.filter(following=user).order_by('date')
                stats = monthStatsExport(follows, "follows")
                if len(stats)==0:
                    return JsonResponse({"error": "No follows found"}, status=402)
                return JsonResponse(stats, safe=False, status=200)
            else:
                return JsonResponse({"error": "You cannot see the stats of another user"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

@api_view(['Post'])
def UserPostPhoto(request, id):
    if request.method=="POST":        
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({"error": "Ivalid user id."}, status=400)
        if user==request.user:
            user.photo = request.FILES['image']
            user.save()
            return JsonResponse({ 
                "id": user.id,
                "photo": request.build_absolute_uri('/')[:-1]+user.photo.url,
            },status=200)
        else:
            return JsonResponse({"error": "You cannot update the photo of another user"}, status=400)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=400)

@api_view(['Post'])
def PostPostPhoto(request, id):
    if request.method=="POST":
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Invalid post id."}, status=400)
        if post.owner==request.user:
            post.media = request.FILES['image']
            post.save()
            return JsonResponse({
                "id": post.id,
                "media": request.build_absolute_uri('/')[:-1]+post.media.url,
            }, status=200)
        else:
            return JsonResponse({"error": "You have to be the owner of a post to update it."}, status=400)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=400)