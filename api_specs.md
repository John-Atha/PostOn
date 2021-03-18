# ENDPOINTS

* If an endpoint gets a request with an unsupported request method, a corresponding error message with status code 400 is returned. 

#### Users
* GET   /users                  :       returns all users (or 402)
* GET   /users/id               :       returns user with the given id (or 400) 
* PUT   /users.id               :       updates username and/or moto (or 400) 
#### Countries
* GET   /countries              :       returns all countries (or 402)
* GET   /countries/id           :       returns country with given id (or 400)   
#### Posts
* GET   /posts                  :       returns all posts (or 402)
* GET   /posts?start=x&end=y    :       return all posts with x<id<y (or 400, or 402)
* POST  /posts                  :       posts a new post (or 400)
* GET   /posts/id               :       returns post with given id (or 400)
* PUT   /posts/id               :       updates text of post with given id (or 400)
#### Follows
* GET   /follows                :       returns all follows (or 402)
* POST  /follows                :       posts a new follow (or 400)
* GET   /follows/id             :       returns follow with the given id (or 400)
* DEL   /follows/id             :       deletes the follow with the given id (or 400)
* GET   /users/id/follows       :       returns the follows that have this user as a follower (or 402)
* GET   /users/id/followers       :     returns the follows that have this user as followed (or 402)