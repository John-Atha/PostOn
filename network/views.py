import json
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
    user = None
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
    else:
        return JsonResponse({"error": "Only GET and PUT methods allowed."}, status=400)

def AllUsers(request):
    if request.method!="GET":
        return JsonResponse({"error": "GET request required."}, status=400)
    else:
        users = User.objects.all()
        if len(users)==0:
            return JsonResponse({"error": "No users found."}, status=402)
        return JsonResponse([user.serialize() for user in users], safe=False, status=200)

def OneCountry(request, id):
    country = None
    try:
        country = Country.objects.get(id=id)
    except Country.DoesNotExist:
        return JsonResponse({"error": f"Invalid country id ({id})."}, status=400) 
    if request.method=="GET":
        return JsonResponse(country.serialize(), status=200)
    else:
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)

def AllCountries(request):
    if request.method=="GET":
        countries = Country.objects.all()
        if len(countries)==0:
            return JsonResponse({"error": "No countries found."}, status=402)
        return JsonResponse([country.serialize() for country in countries], safe=False, status=200)
    else:
        return JsonResponse({"error": "Only GET method is allowed."}, status=400)

def OnePost(request, id):
    post = None
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
    else:
        return JsonResponse({"error": "Only GET and PUT methods are allowed."}, status=400)

def AllPosts(request):
    if request.method=="GET":
        allPosts = Post.objects.all()
        if len(allPosts)==0:
            return JsonResponse({"error": "No posts found."}, status=402)
        else:
            return JsonResponse([post.serialize() for post in allPosts], safe=False, status=200)
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

