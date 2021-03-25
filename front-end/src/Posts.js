import React from "react";
import "./Posts.css";

import {isLogged, getPosts, getLikesSample, getPostsCommentsSample, myLikes, LikePost, UnLikePost, getAllLikes} from './api';
import user_icon from './images/user-icon.png'; 
import like_icon from './images/like.png';
import liked_icon from './images/liked.png';
import comment_icon from './images/comment.png';
import Likes from './Likes';
import Comments from './Comments';

class OnePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            id: this.props.id,
            owner: this.props.owner,
            media: this.props.media,
            text: this.props.text,
            date: this.props.date,
            liked: this.props.liked,
            likesNum: 0,
            commentsNum: 0,
            likerSample: {
                username: "Loading..."
            },
            commentSample: {
                owner: {
                    username: "Loading..."
                },
            },
            likes_error: null,
            comments_error: null,
            likesShow: false,
            commentsShow: false,
        }
        this.likesSample = this.likesSample.bind(this);
        this.commentsSample = this.commentsSample.bind(this);
        this.statsSample = this.statsSample.bind(this);
        this.showLikes = this.showLikes.bind(this);
        this.showHideComments = this.showHideComments.bind(this);
        this.postLike = this.postLike.bind(this);
        this.postUnLike = this.postUnLike.bind(this);
    }

    postUnLike = () => {
        getAllLikes(1, this.state.id, "post")
        .then(response => {
            console.log(response);
            response.data.forEach(like => {
                if(like.owner.id===this.state.userId) {
                    UnLikePost(like.id)
                    .then(response => {
                        console.log(response);
                        this.setState({
                            liked: false,
                        })    
                        this.likesSample();
                    })
                    .catch(err => {
                        console.log(err);
                    })
            
                }
            })
        })
        .catch(err => {
            console.log(err);
        })
        
    }

    postLike = () => {
        LikePost(this.state.userId, this.state.id)
        .then(response => {
            console.log(response);
            this.setState({
                liked: true,
            })
            this.likesSample();
        })
        .catch(err => {
            console.log(err);
        })
    }

    showLikes = (event) => {
        this.setState({
            likesShow: true,
        })
        let box = event.target.parentElement.parentElement.parentElement;
        console.log(box);
        let children = box.children;
        console.log(children);
        if (children[7]) {
            children[7].style.display = "block";
        }
    }

    showHideComments = () => {
        this.setState({
            commentsShow: !this.state.commentsShow,
        })
    }

    commentsSample = () => {
        setTimeout(()=> {}, 1000);
        getPostsCommentsSample(this.state.id)
        .then(response => {
            console.log(response);
            this.setState({
                commentsNum: response.data.comments,
                commentSample: response.data["one-comment"],
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                comments_error: "No comments found",
            })
        })
    }

    likesSample = () => {
        setTimeout(()=> {}, 1000);
        getLikesSample(this.state.id, "post")
        .then(response => {
            console.log(response);
            this.setState({
                likesNum: response.data.likes,
                likerSample: response.data["one-liker"],
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                likes_error: "No likes found",
            })
        })

    }

    statsSample = () => {
        this.likesSample();
        this.commentsSample();
    }

    componentDidMount() {
        this.statsSample();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id!==this.props.id || prevProps.liked!==this.props.liked) {
            console.log("NEW POST!!")
            this.setState({
                id: this.props.id,
                owner: this.props.owner,
                media: this.props.media,
                text: this.props.text,
                date: this.props.date,
                liked: this.props.liked    
            })
            this.statsSample();
        }
    }

    render() {
        let datetime = this.state.date.replace('T', ' ').replace('Z', '').split(' ')
        let date = datetime[0]
        let time = datetime[1]
        return(
            <div className="post-container">
                <div className="flex-layout">
                    <div className="user-photo-container">
                        <img className="user-photo" src={user_icon} alt="user profile" />
                    </div>
                    <div>
                        <div className="owner-name">{this.state.owner.username}</div>
                        <div className="post-date">{time}<br></br>{date}</div>
                    </div>
                </div>
                <hr className="no-margin"></hr>
                <div className="post-text">{this.state.text}</div>
                <hr className="no-margin"></hr>
                <div className="stats-sample flex-layout">
                    <div className="likes-sample">
                        <img className="like-icon" src={like_icon} alt="like-icon"/>
                        {this.state.likesNum>1 &&
                            <button className="liker-sample button-as-link-grey" onClick={this.showLikes}>{this.state.likerSample.username} and {this.state.likesNum-1} more</button>
                        }
                        {this.state.likesNum===1 &&
                            <button className="liker-sample button-as-link-grey">{this.state.likerSample.username}</button>
                        }
                        {!this.state.likesNum &&
                            <button disabled={true} className="liker-sample button-as-link-grey">0</button>
                        }
                    </div>
                    <div className="comments-sample">
                        <img className="like-icon" src={comment_icon} alt="comment-icon"/>
                        {this.state.commentsNum>1 &&
                            <button className="likes-sample-num button-as-link-grey" onClick={this.showHideComments}>{this.state.commentSample.owner.username} and {this.state.commentsNum-1} more</button>
                        }
                        {this.state.commentsNum===1 &&
                            <button className="likes-sample-num button-as-link-grey" onClick={this.showHideComments}>{this.state.commentSample.owner.username}</button>
                        }
                        {!this.state.commentsNum &&
                            <button disabled={true} className="likes-sample-num button-as-link-grey">0</button>
                        }
                    </div>
                </div>
                <hr className="no-margin"></hr>
                <div className="post-actions center-content flex-layout">
                    <div className="flex-item-small center-content">
                        {!this.state.liked &&
                            <button className="likes-action flex-layout button-as-link" onClick={this.postLike}>
                                <img className="like-icon" src={like_icon} alt="like-icon"/>
                                <div>Like</div>
                            </button>
                        }
                        {this.state.liked &&
                            <button className="likes-action flex-layout button-as-link" onClick={this.postUnLike}>
                                <img className="like-icon" src={liked_icon} alt="liked-icon"/>
                                <div className="blue-color">Liked</div>
                            </button>
                        }                        
                    </div>
                    <div className="flex-item-small center-content">
                        <button className="comments-action flex-layout button-as-link">
                                <img className="like-icon" src={comment_icon} alt="comment-icon"/>
                                <div>Comment</div>
                        </button>
                    </div>
                </div>
                {this.state.likesShow &&
                    <Likes id={this.state.id}
                        userId={this.state.userId}
                        logged={this.state.logged}
                           on={"post"}
                           liked={this.state.liked} 
                    />
                }
                <hr className="no-margin"></hr>
                {this.state.commentsNum && this.state.commentsShow &&
                    <Comments userId={this.state.userId}
                            postId={this.state.id}
                            logged={this.state.logged}
                            how={"sample"}
                            sample={this.state.commentSample}
                    />
                }
            </div>
        )
    }
}

class Posts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: null,
            logged: false,
            error: null,
            followingPosts: false,
            postsList: [],
            start: 1,
            end: 10,
            case: this.props.case,
            likesEnd: 1,
            likesList: [],
        }
        this.likesIncr = 10;
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askPosts = this.askPosts.bind(this);
        this.askLikes = this.askLikes.bind(this);
    }

    moveOn = () => {
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        setTimeout(() => this.askPosts(), 500);
    }
    
    previousPage = () => {
        setTimeout(this.setState({
            start: this.state.start-10,
            end: this.state.end-10,
        }), 0)
        this.moveOn();
    }
    nextPage = () => {
        setTimeout(this.setState({
            start: this.state.start+10,
            end: this.state.end+10,
        }), 0)
        this.moveOn();
        setTimeout(()=>this.askLikes(), 750);
    }

    askLikes = () => {
        this.state.postsList.map((value) => {
            if (this.state.likesList.includes(value.id)) {
                this.likesIncr++;
            }
        })
        console.log(`I ask likes from ${this.state.likesEnd} to ${this.state.likesEnd+this.likesIncr+1}`);
        myLikes(this.state.likesEnd, this.state.likesEnd+this.likesIncr, this.state.userId)
        .then(response => {
            console.log(response);
            let tempLikesList = this.state.likesList;
            response.data.forEach(el => {
                if (!tempLikesList.includes(el.post.id)) {
                    tempLikesList.push(el.post.id);
                }
            })
            this.setState({
                likesList: tempLikesList,
                likesEnd: this.state.likesEnd+this.likesIncr,
            })
            console.log("likesList: ");
            console.log(tempLikesList);
            this.likesIncr = 0;
        })
        .catch(err => {
            console.log(err);
            console.log("No more likes found for this user.")
        })
    }

    askPosts = () => {
        setTimeout(()=> {}, 1000)
        console.log(`I am asking posts from ${this.state.start} to ${this.state.end}`)
        getPosts(this.state.start, this.state.end, this.state.case)
        .then(response => {
            console.log(response);
            this.setState({
                postsList: response.data,
            })
            console.log(this.state.postsList)
        })
        .catch(err => {
            console.log(err);
        })

    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            });
            this.askLikes();
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: err,
            })
        })
        setTimeout(()=>this.askPosts(), 200);
    }

    render() {
        return(
            <div className="posts-container padding-bottom flex-item">
                {this.state.case==="all" &&
                    <h4 className="center-text">All Posts</h4>
                }
                {this.state.case==="following" &&
                    <h4 className="center-text">Following Posts</h4>
                }
                {this.state.postsList.length && this.state.postsList.map((value, index) => {
                    let liked=null;
                    console.log(value.id);
                    if (this.state.likesList.includes(value.id)) {
                        console.log("liked")
                        liked=true;
                    }
                    else {
                        liked=false;
                    }
                    return(
                        <OnePost key={index}
                                    id={value.id}
                                    owner={value.owner}
                                    text={value.text}
                                    media={value.media}
                                    date={value.date}
                                    userId={this.state.userId}
                                    logged={this.state.logged}
                                    liked={liked}/>
                    )
                    
                })}
                {this.state.postsList.length &&
                    <div className="pagi-buttons-container flex-layout center-content">
                        <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                        <button disabled={!this.state.postsList.length} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                    </div>
                }
                {!this.state.postsList.length &&
                    <div className="error-message margin-top center-text">Oops, no posts found..</div>
                }
            </div>
        )
    }
}

export default Posts;