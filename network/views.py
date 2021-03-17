import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import *


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
        return JsonResponse([user.serialize() for user in users], safe=False)
