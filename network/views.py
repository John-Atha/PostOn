import json
from typing import Type
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import *
from datetime import datetime


def index(request):
    return render(request, "network/index.html")

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
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def OneUser(request, id):
    if request.method!="GET" and request.method!="PUT":
        return JsonResponse({"error": "Only GET and PUT methods are allowed."}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({"error": f"Invalid user id ({id})."}, status=400) 
        if request.method=="PUT":
            smthNew = False
            data = json.loads(request.body)
            if data.get("username") is not None:  
                user.username = data["username"]
                smthNew = True
            if data.get("moto") is not None:
                user.moto = data["moto"]
                smthNew = True
            if smthNew:
                try:
                    user.save()
                    return JsonResponse(user.serialize(), status=200)
                except:
                    return JsonResponse({"error": "Username probably already exists"} , status=400)

            else:
                return JsonResponse({"error": "Give new username and/or moto field"} , status=400)
            
        elif request.method=="GET":
            return JsonResponse(user.serialize())

def AllUsers(request):
    if request.method!="GET":
        return JsonResponse({"error": "GET request required."}, status=400)
    else:
        users = User.objects.all()
        if len(users)==0:
            return JsonResponse({"error": "No users found."}, status=402)
        return JsonResponse([user.serialize() for user in users], safe=False, status=200)

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
        if len(countries)==0:
            return JsonResponse({"error": "No countries found."}, status=402)
        return JsonResponse([country.serialize() for country in countries], safe=False, status=200)
    else:
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)

def OnePost(request, id):
    if request.method!="GET" and request.method!="PUT" and request.method!="DELETE":
        return JsonResponse({"error": "Only GET and PUT methods are allowed."}, status=400)
    else:
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": f"Invalid post id ({id})."}, status=400)
        if request.method=="GET":
            return(JsonResponse(post.serialize(), status=200))
        elif request.method=="PUT":
            data = json.loads(request.body)
            if data.get("text") is not None:
                if post.text!=data["text"]:
                    post.text = data["text"]
                    post.date = str(datetime.now())
                    post.save()
                    return JsonResponse(post.serialize(), status=200)
        elif request.method=="DELETE":
            post.delete()
            return JsonResponse({"message": "Post deleted successfully"}, status=200)

def UserPosts(request, id):
    if request.method!="GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)
    else:
        try:
            user = User.objects.get(id=id)
            posts = user.posts.all()
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
                return JsonResponse([post.serialize() for post in posts], safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

def AllPosts(request):
    if request.method=="GET": 
        posts = Post.objects.order_by('-date')
        if request.GET.get('start'):
            try:
                start =  int(request.GET.get("start"))
                if (start<1):
                    return JsonResponse({"error": "Bad start parameter given."}, status=400)
                posts = posts[start-1:]
                if request.GET.get("end"):
                    try:
                        end =  int(request.GET.get("end"))
                        if end<start or end<1:
                            return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                        posts = posts[:end-start+1]
                    except ValueError:
                        return JsonResponse({"error": "Bad params given."}, status=400)
            except ValueError:
                return JsonResponse({"error": "Bad params given."}, status=400)
        if len(posts)==0:
            return JsonResponse({"error": "No posts found."}, status=402)
        else:
            return JsonResponse([post.serialize() for post in posts], safe=False, status=200)
    elif request.method=="POST":
        data = json.loads(request.body)
        if data.get("owner") is not None:
            if data.get("owner").get("id") is not None:
                ownId = data["owner"]["id"]
                try:
                    owner = User.objects.get(id=ownId)
                    if data.get("text") is not None:
                        if len(str(data["text"])):
                            post = Post(owner=owner, text=str(data["text"]))
                            post.save()
                            return JsonResponse(post.serialize(), status=200)
                        else:
                            return JsonResponse({"error": "No text given."}, status=400)   
                    else:
                        return JsonResponse({"error": "No text given."}, status=400)        
                except User.DoesNotExist:
                    return JsonResponse({"error": "Bad owner given."}, status=400)        
            else:
                return JsonResponse({"error": "Bad owner given."}, status=400)
        else:
            return JsonResponse({"error": "No owner given."}, status=400)        
    else:
        return JsonResponse({"error": "Only GET and POST methods are allowed."}, status=400)

def AllFollows(request):
    if request.method=="GET":
        AllFollows = Follow.objects.order_by('-date')
        if len(AllFollows)==0:
            return JsonResponse({"error": "No follows found"}, status=402)
        else:
            return JsonResponse([follow.serialize() for follow in AllFollows], safe=False, status=200)
    elif request.method=="POST":
        data = json.loads(request.body)
        if data.get("following"):
            if data.get("following").get("id"):
                try:
                    following = User.objects.get(id=data["following"]["id"])
                    if data.get("followed"):
                        if data.get("followed").get("id"):
                            try:
                                followed = User.objects.get(id=data["followed"]["id"])
                                if followed!=following:
                                    follow = Follow(following=following, followed=followed)
                                    follow.save()
                                    return JsonResponse(follow.serialize(), status=200)
                                else:
                                    return JsonResponse({"error": "A user cannot follow his/her self"}, status=400)
                            except User.DoesNotExist:
                                return JsonResponse({"error": "Invalid followed id"}, status=400)
                        else:
                            return JsonResponse({"error": "Invalid followed user given"}, status=400)
                    else:
                        return JsonResponse({"error": "Invalid followed user given"}, status=400)
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid follower id"}, status=400)
            else:
                return JsonResponse({"error": "Invalid follower user given"}, status=400)
        else:
            return JsonResponse({"error": "Invalid follower user given"}, status=400)
    else:
        return JsonResponse({"error": f"Only GET, POST and DEL methods are allowed."}, status=400)

def OneFollow(request, id):
    if request.method!="GET" and request.method!="DELETE":
        return JsonResponse({"error": "Only GET and DEL methods are allowed."}, status=400)
    else:
        try:
            follow = Follow.objects.get(id=id)
        except Follow.DoesNotExist:
            return JsonResponse({"error": "Invalid follow id"}, status=400)
        if request.method=="GET":
            return JsonResponse(follow.serialize(), status=200)
        elif request.method=="DELETE":
            follow.delete()
            return JsonResponse({"message": "Follow deleted successfully"}, status=200)

def UserFollows(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            follows = user.follows.order_by('-date')
            if request.GET.get("start"):
                try:
                    start = int(request.GET.get("start"))
                    if start<1:
                        return JsonResponse({"error": "Bad start parameter given."}, status=400)
                    follows = follows[start-1:]
                    if request.GET.get("end"):
                        try:
                            end = int(request.GET.get("end"))
                            if (end<start):
                                return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                            follows = follows[:end-start+1]
                        except ValueError:
                            return JsonResponse({"error": "Bad end parameter given."}, status=400)
                except ValueError:
                    return JsonResponse({"error": "Bad start parameter given."}, status=400)
            if len(follows)==0:
                return JsonResponse({"error": "No follows found for this user"}, status=402)
            else:
                return JsonResponse([follow.serialize() for follow in follows], safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def UserFollowers(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            follows = user.followers.order_by('-date')
            if request.GET.get("start"):
                try:
                    start = int(request.GET.get("start"))
                    if start<1:
                        return JsonResponse({"error": "Bad start parameter given."}, status=400)
                    follows = follows[start-1:]
                    if request.GET.get("end"):
                        try:
                            end = int(request.GET.get("end"))
                            if (end<start):
                                return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                            follows = follows[:end-start+1]
                        except ValueError:
                            return JsonResponse({"error": "Bad end parameter given."}, status=400)
                except ValueError:
                    return JsonResponse({"error": "Bad start parameter given."}, status=400)
            if len(follows)==0:
                return JsonResponse({"error": "No follows found for this user"}, status=402)
            else:
                return JsonResponse([follow.serialize() for follow in follows], safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)

    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400) 

def AllLikes(request):
    if request.method=="GET":
        likes = Like.objects.order_by('-date')
        if request.GET.get("start"):
            try:
                start = int(request.GET.get("start"))
                if start<1:
                    return JsonResponse({"error": "Invalid start parameter given"}, status=400)
                likes = likes[start-1:]
                if request.GET.get("end"):
                    try:
                        end = int(request.GET.get("end"))
                        if end<start:
                            return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                        likes = likes[:end-start+1]
                    except ValueError:
                        return JsonResponse({"error": "Invalid end parameter given"}, status=400)
            except ValueError:
                return JsonResponse({"error": "Invalid start parameter given"}, status=400)
        if len(likes)==0:
            return JsonResponse({"error": "No likes found"}, status=402)
        else:
            return JsonResponse([like.serialize() for like in likes], safe=False, status=200)
    elif request.method=="POST":
        data = json.loads(request.body)
        if data.get("owner"):
            if data.get("owner").get("id"):
                try:
                    ownerId = int(data["owner"]["id"])
                except ValueError:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
                try:
                    owner = User.objects.get(id=ownerId)
                    if data.get("post"):
                        if data.get("post").get("id"):
                            try:
                                postId = int(data["post"]["id"])
                                try:
                                    post = Post.objects.get(id=postId)
                                    like = Like(owner=owner, post=post)
                                    like.save()
                                    return JsonResponse(like.serialize(), status=200)
                                except Post.DoesNotExist:
                                    return JsonResponse({"error": "Invalid post id."}, status=400)                                
                            except ValueError:
                                return JsonResponse({"error": "Invalid post id."}, status=400)
                        else:
                            return JsonResponse({"error": "Invalid post id."}, status=400)
                    else:
                        return JsonResponse({"error": "Invalid post given."}, status=400)
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
            else:
                return JsonResponse({"error": "Invalid owner id."}, status=400)
        else:
            return JsonResponse({"error": "Invalid owner given."}, status=400)
    else:
        return JsonResponse({"error": "Only GET and POST methods are allowed"}, status=400)

def OneLike(request, id):
    if request.method!="GET" and request.method!="DELETE":
        return JsonResponse({"error": "Only GET, PUT, DEL methods are allowed"}, status=400)
    else:
        try:
            like= Like.objects.get(id=id)
        except Like.DoesNotExist:
            return JsonResponse({"error": "Invalid like id"}, status=400)
        if request.method=="GET":
            return JsonResponse(like.serialize(), status=200)
        elif request.method=="DELETE":
            like.delete()
            return JsonResponse({"message": "Like deleted succesfully"}, status=200)

def UserLikes(request, id):
    if request.method=="GET":
        try:
            user = User.objects.get(id=id)
            likes = user.likes.order_by('-date')
            if request.GET.get("start"):
                try:
                    start = int(request.GET.get("start"))
                    if start<1:
                        return JsonResponse({"error": "Bad start parameter given."}, status=400)
                    likes = likes[start-1:]
                    if request.GET.get("end"):
                        try:
                            end = int(request.GET.get("end"))
                            if (end<start):
                                return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                            likes = likes[:end-start+1]
                        except ValueError:
                            return JsonResponse({"error": "Bad end parameter given."}, status=400)
                except ValueError:
                    return JsonResponse({"error": "Bad start parameter given."}, status=400)
            if len(likes)==0:
                return JsonResponse({"error": "No likes found for this user"}, status=402)
            else:
                return JsonResponse([likes.serialize() for likes in likes], safe=False, status=200)
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
            if request.GET.get("start"):
                try:
                    start = int(request.GET.get("start"))
                    if start<1:
                        return JsonResponse({"error": "Bad start parameter given."}, status=400)
                    likes = likes[start-1:]
                    if request.GET.get("end"):
                        try:
                            end = int(request.GET.get("end"))
                            if (end<start):
                                return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                            likes = likes[:end-start+1]
                        except ValueError:
                            return JsonResponse({"error": "Bad end parameter given."}, status=400)
                except ValueError:
                    return JsonResponse({"error": "Bad start parameter given."}, status=400)
            if len(likes)==0:
                return JsonResponse({"error": "No likes found for this user"}, status=402)
            else:
                return JsonResponse([likes.serialize() for likes in likes], safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user id"}, status=400)
    else:
        return JsonResponse({"error": "Only GET method is allowed"}, status=400)

def AllComments(request):
    if request.method=="GET":
        comments = Comment.objects.order_by('-date')
        if request.GET.get("start"):
            try:
                start = int(request.GET.get("start"))
                if start<1:
                    return JsonResponse({"error": "Invalid start parameter given"}, status=400)
                comments = comments[start-1:]
                if request.GET.get("end"):
                    try:
                        end = int(request.GET.get("end"))
                        if end<start:
                            return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                        comments = comments[:end-start+1]
                    except ValueError:
                        return JsonResponse({"error": "Invalid end parameter given"}, status=400)
            except ValueError:
                return JsonResponse({"error": "Invalid start parameter given"}, status=400)
        if len(comments)==0:
            return JsonResponse({"error": "No comments found"}, status=402)
        else:
            return JsonResponse([comment.serialize() for comment in comments], safe=False, status=200)
    elif request.method=="POST":
        data = json.loads(request.body)
        if data.get("owner"):
            if data.get("owner").get("id"):
                try:
                    ownerId = int(data["owner"]["id"])
                except ValueError:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
                try:
                    owner = User.objects.get(id=ownerId)
                    if data.get("post"):
                        if data.get("post").get("id"):
                            try:
                                postId = int(data["post"]["id"])
                                try:
                                    post = Post.objects.get(id=postId)
                                    if data.get("text"):
                                        text = data["text"]
                                        if len(text)>0:
                                            comment = Comment(owner=owner, post=post, text=text)
                                            comment.save()
                                            return JsonResponse(comment.serialize(), status=200)
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
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid user id."}, status=400)
            else:
                return JsonResponse({"error": "Invalid owner id."}, status=400)
        else:
            return JsonResponse({"error": "Invalid owner given."}, status=400)
    else:
        return JsonResponse({"error": "Only GET and POST methods are allowed"}, status=400)

def OneComment(request, id):
    if request.method!="GET" and request.method!="DELETE":
        return JsonResponse({"error": "Only GET, PUT, DEL methods are allowed"}, status=400)
    else:
        try:
            comment= Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Invalid comment id"}, status=400)
        if request.method=="GET":
            return JsonResponse(comment.serialize(), status=200)
        elif request.method=="DELETE":
            comment.delete()
            return JsonResponse({"message": "Comment deleted succesfully"}, status=200)
