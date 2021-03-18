# ENDPOINTS

* If an endpoint gets a request with an unsupported request method, a corresponding error message with status code 400 is returned. 
* Base url: Jwitter/api
* All query parameters are optional, but use is recommended for higher performance

#### Users
* GET   /users                                      :       returns all users (or 402)
* GET   /users/{id}                                 :       returns user with the given id (or 400) 
* PUT   /users/{id}                                 :       updates username and/or moto (or 400) 

#### Countries
* GET   /countries                                  :       returns all countries (or 402)
* GET   /countries/{id}                             :       returns country with given id (or 400)   

#### Posts
* GET   /posts?start=index1&end=index2              :       return all posts with index1<post_index<index2 (or 400, or 402)
* POST  /posts                                      :       posts a new post (or 400)
* GET   /posts/{id}                                 :       returns post with given id (or 400)
* PUT   /posts/{id}                                 :       updates text of post with given id (or 400)
* DEL   /posts/{id}                                 :       deletes post with given id (or 400)
* GET   /users/{id}/posts?start=index1&end=index2   :       returns all posts by the user with the given id and index1<post_index<index2 (or 400 or 402) 

#### Follows
* GET   /follows                                      :       returns all follows (or 402)
* POST  /follows                                      :       posts a new follow (or 400)
* GET   /follows/{id}                                 :       returns follow with the given id (or 400)
* DEL   /follows/{id}                                 :       deletes the follow with the given id (or 400)
* GET   /users/{id}/follows?start=index1&end=index2   :       returns the follows that have this user as a follower with index1<follow_index<index2 (or 402)
* GET   /users/{id}/followers?start=index1&end=index2 :       returns the follows that have this user as followed with index1<follow_index<index2 (or 402)

#### Likes
* GET   /likes?start=index1&end=index2              :       returns all likes with index1<like_index<index2 (or 400, or 402)
* POST  /likes                                      :       posts a new like (or 400)
* GET   /likes/{id}                                 :       returns the like with the given id (or 400)
* DEL   /likes/{id}                                 :       deletes the like with the given id (or 400)
* GET   /users/{id}/likes?start=index1&end=index2   :       returns the likes that this user has done with index1<like_index<index2 (or 402)
* GET   /users/{id}/liked?start=index1&end=index2   :       returns the likes on posts of this owner with index1<like_index<index2 (or 402)