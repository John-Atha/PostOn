# ENDPOINTS

* If an endpoint gets a request with an unsupported request method, a corresponding error message with status code 400 is returned. 
* Base url: Jwitter/api
* All query parameters are optional, but use is recommended for higher performance

#### Users
* GET   /users?start=index1&end=index2              :       returns all users with index1<user_index<index2 (or 400, 402)
* GET   /users/{id}                                 :       returns user with the given id (or 400) 
* PUT   /users{id}/mod                                 :       updates username and/or moto (or 400 or 401) 
* GET   /users/{id}/activity                            :       returns the activity (likes, comments, likes on comments, posts, follows) of user with given id (or 400, or 402)
* GET   /users/{id}/notifications                       :       returns the (unread) notifications (likes & comments on my posts, likes on my comments, new followers) of user with given id (or 400, or 402)
* PUT   /users/{id}/allread                             :       marks all the unread notifications of user with given id to seen
* GET   /users/{id}/stats/likes/monthly                             :       returns a list with #likes on posts per month of the user with the given id (or 400 or 402)
* GET   /users/{id}/stats/likes/daily                               :       returns a list with #likes on posts per day(Monday, Tuesday,...) of the user with the given id (or 400 or 402)
* GET   /users/{id}/stats/comments/monthly                          :       returns a list with #comments on  posts per month of the user with the given id (or 400 or 402)
* GET   /users/{id}/stats/comments/daily                            :       returns a list with #comments on  posts per day(Monday, Tuesday,...) of the user with the given id (or 400 or 402)
* GET   /users/{id}/stats/follows/monthly                           :       returns a list with #follows per month of the user with the given id (or 400 or 402)
* GET   /users/{id}/stats/follows/daily                             :       returns a list with #follows per day(Monday, Tuesday,...) of the user with the given id (or 400 or 402)
* GET   /users/{id}/stats/posts/monthly                             :       returns a list with #posts per month of the user with the given id (or 400 or 402)
* GET   /users/{id}/stats/posts/daily                               :       returns a list with #posts per day(Monday, Tuesday,...) of the user with the given id (or 400 or 402)

#### Countries
* GET   /countries?start=index1&end=index2          :       returns all countries with index1<country_index<index2 (or 400, 402)
* GET   /countries/{id}                             :       returns country with given id (or 400)   

#### Posts
* GET   /posts?start=index1&end=index2                      :       return all posts with index1<post_index<index2 (or 400, or 402)
* POST  /posts/mod                                              :       posts a new post (or 400 or 401)
* GET   /posts/{id}                                         :       returns post with given id (or 400)
* PUT   /posts{id}/mod                                         :       updates text of post with given id (or 400 or 401)
* DEL   /posts{id}/mod                                         :       deletes post with given id (or 400 or 401)
* GET   /users/{id}/posts?start=index1&end=index2           :       returns all posts by the user with the given id and index1<post_index<index2 (or 400 or 402)
* GET   /users/{id}/follows/posts?start=index1&end=index2   :       returns all posts by the followed users from the user with the given id and index1<post_index<index2 (or 400 or 402)
* GET   /posts/{id}/likes?start=index1&end=index2   :       returns all likes on the post with the given id and index1<like_index<index2 (or 400 or 402)
* GET   /posts/{id}/likes/sample                    :       returns #likes and the first like on the post with the given id (or 400 or 402)
* GET   /posts/{id}/comments?start=index1&end=index2   :       returns all comments on the post with the given id and index1<comment_index<index2 (or 400 or 402)
* GET   /posts/{id}/comments/sample                    :       returns #comments and the first comment on the post with the given id (or 400 or 402)

#### Follows
* GET   /follows                                      :       returns all follows (or 402)
* POST  /follows/mod                                   :       posts a new follow (or 400 or 401)
* GET   /follows/{id}                                 :       returns follow with the given id (or 400)
* DEL   /follows{id}/mod                                 :       deletes the follow with the given id (or 400 or 401)
* PUT   /follows{id}/mod                                 :       updates the follow with the given id to seen / not seen (or 400 or 401)
* GET   /users/{id}/follows?start=index1&end=index2   :       returns the follows that have this user as a follower with index1<follow_index<index2 (or 402 or 400)
* GET   /users/{id}/follows/count                     :       returns the #follows that have this user as a follower (or 400)
* GET   /users/{id}/followers?start=index1&end=index2 :       returns the follows that have this user as followed with index1<follow_index<index2 (or 402 or 400)
* GET   /users/{id}/followers/count                     :       returns the #follows that have this user as followed (or 400)

#### Likes
* GET   /likes?start=index1&end=index2              :       returns all likes with index1<like_index<index2 (or 400, or 402)
* POST  /likes/mod                                   :       posts a new like (or 400 or 401)
* GET   /likes/{id}                                 :       returns the like with the given id (or 400)
* DEL   /likes{id}/mod                                 :       deletes the like with the given id (or 400 or 401)
* PUT   /likes{id}/mod                                 :       updates the like with the given id to seen / not seen (or 400 or 401)
* GET   /users/{id}/likes?start=index1&end=index2   :       returns the likes that this user has posted with index1<like_index<index2 (or 402)
* GET   /users/{id}/liked?start=index1&end=index2   :       returns the likes on posts of this owner with index1<like_index<index2 (or 402)

#### Comments
* GET   /comments?start=index1&end=index2              :       returns all comments with index1<like_index<index2 (or 400, or 402)
* POST  /comments/mod                                   :       posts a new comment (or 400 or 401)
* GET   /comments/{id}                                 :       returns the comment with the given id (or 400 or 401)
* DEL   /comments/{id}/mod                                 :       deletes the comment with the given id (or 400 or 401)
* PUT   /comments/{id}/mod                                 :       updates the comment with the given id to seen / not seen (or 400 or 401)
* GET   /users/{id}/comments?start=index1&end=index2   :       returns the comments that this user has posted with index1<like_index<index2 (or 402)
* GET   /users/{id}/commented?start=index1&end=index2  :       returns the comments on posts of this owner with index1<like_index<index2 (or 402)
* GET   /comments/{id}/likes?start=index1&end=index2   :       returns all likes on the comment with the given id and index1<comment_index<index2 (or 400 or 402)
* GET   /comments/{id}/likes/sample                    :       returns #likes and the first like on the comment with the given id (or 400 or 402)

#### Likes on comments
* GET   /likecomments?start=index1&end=index2              :       returns all comments with index1<like_index<index2 (or 400, or 402)
* POST  /likecomments/mod                                   :       posts a new comment (or 400 or 401)
* GET   /likecomments/{id}                                 :       returns the comment with the given id (or 400 or 401)
* DEL   /likecomments/{id}/mod                                 :       deletes the comment with the given id (or 400 or 401)
* PUT   /likecomments/{id}/mod                                 :       updates the comment with the given id to seen / not seen (or 400 or 401)
* GET   /users/{id}/likescomments?start=index1&end=index2   :       returns the comments that this user has posted with index1<like_index<index2 (or 402)
* GET   /users/{id}/likedcomments?start=index1&end=index2  :       returns the comments on posts of this owner with index1<like_index<index2 (or 402)

#### General
* POST  /login                                           :       logges user in (or 400)
* POST  /logout                                          :       logges user out (or 400)
* POST  /logged                                          :       checks if user is logged in 
* GET   /stats/likes/monthly                             :       returns a list with #likes on posts per month (of all users)
* GET   /stats/likes/daily                               :       returns a list with #likes on posts per day(Monday, Tuesday,...) (of all users)
* GET   /stats/comments/monthly                          :       returns a list with #comments on  posts per month (of all users)
* GET   /stats/comments/daily                            :       returns a list with #comments on  posts per day(Monday, Tuesday,...) (of all users)
* GET   /stats/follows/monthly                           :       returns a list with #follows per month (of all users)
* GET   /stats/follows/daily                             :       returns a list with #follows per day(Monday, Tuesday,...) (of all users)
* GET   /stats/posts/monthly                             :       returns a list with #posts per month (of all users)
* GET   /stats/posts/daily                               :       returns a list with #posts per day(Monday, Tuesday,...) (of all users)
* GET   /stats/likecomments/monthly                      :       returns a list with #likes on comments per month (of all users)
* GET   /stats/likecomments/daily                        :       returns a list with #likes on comments per day(Monday, Tuesday,...) (of all users)