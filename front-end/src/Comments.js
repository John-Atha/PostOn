import React from "react";
import './Comments.css';

import user_icon from './images/user-icon.png'; 
import like_icon from './images/like.png';

import Likes from './Likes'
import {getPostsComments, getLikesSample} from './api';


class OneComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.comment,
            likesNum: 0,
            likerSample: {
                username: "Loading..."
            },
            likes_error: null,
            likesShow: false,
        }

        this.likesSample = this.likesSample.bind(this);
        this.showLikes = this.showLikes.bind(this);
    }

    showLikes = (event) => {
        this.setState({
            likesShow: true,
        })
        let box = event.target.parentElement;
        let children = box.children;
        if (children[2]) {
            children[2].style.display = "block";
        }
    }

    likesSample = () => {
        setTimeout(()=> {}, 2000);
        getLikesSample(this.state.comment.id, "comment")
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

    componentDidMount() {
        this.likesSample();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.comment.id!==this.props.comment.id) {
            this.likesSample();
        }
    }


    render() {
        let commentDatetime = null;
        let commentDate = null;
        let commentTime = null;
        if (this.state.comment.owner.username!=="Loading...") {
            commentDatetime = this.state.comment.date.replace('T', ' ').replace('Z', '').split(' ')
        }
        return (
            <div className="comment-box flex-item-expand">
                <div className="flex-layout">
                    <div className="user-photo-container-small">
                            <img className="user-photo" src={user_icon} alt="user profile" />
                        </div>
                    <div className="owner-name">{this.state.comment.owner.username}</div>
                    <div className="post-date comment-date">at {commentDatetime}</div>
                </div>
                <div className="text-comment">{this.state.comment.text}</div>
                <div className="comment-like-container flex-layout">
                    <img className="like-icon" src={like_icon} alt="like-icon"/>
                    {this.state.likesNum>1 &&
                        <button className="liker-sample button-as-link " onClick={this.showLikes}>{this.state.likerSample.username} and {this.state.likesNum-1} more</button>
                    }
                    {this.state.likesNum===1 &&
                        <div className="liker-sample">{this.state.likerSample.username}</div>
                    }
                    {!this.state.likesNum &&
                        <div className="liker-sample">0</div>
                    }
                    {this.state.likesShow &&
                    <Likes id={this.state.comment.id}
                           userId={this.state.userId}
                           logged={this.state.logged}
                           on={"comment"} 
                    />
                }

                </div>
            </div>
        )
    }
}


class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            postId: this.props.postId,
            start: 1,
            end: 5,
            commentsList: [],
            how: this.props.how,
            commentSample: this.props.sample,
            commentsSize: 1,
            comments_err: null,
            nomore: false,
        }
        this.seeMore = this.seeMore.bind(this);
        this.askComments = this.askComments.bind(this);
    }

    
    seeMore = () => {
        setTimeout(this.setState({
            start: this.state.how==="sample" ? 1 : this.state.start+5,
            end: this.state.how==="sample" ? 5 :this.state.end+5,
            how: "all",
        }), 0)
        setTimeout(() => this.askComments(), 1000);    
    }

    askComments = () => {
        if (this.state.how!=="sample") {
            setTimeout(()=>{}, 2000);
            console.log(`I am asking comments from ${this.state.start} to ${this.state.end}`)
            getPostsComments(this.state.start, this.state.end, this.state.postId)
            .then(response => {
                console.log(response);
                this.setState({
                    error: null,
                    commentsList: this.state.commentsList.concat(response.data),
                    nomore: response.data.length<5,
                })
                
                console.log(this.state.commentsList.concat(response.data))
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    comments_err: "No more comments found",
                })
            })
        }
    }

    componentDidMount() {
        if (this.state.how==="sample") {
            ;
        }
        else {
            this.askComments();
        }

    }

    render() {

        if (this.state.how==="sample") {
            return (
                <div className="all-comments-container center-content">
                    <OneComment comment={this.state.commentSample}/>
                    <button className="button-as-link center-text" onClick={this.seeMore}>Show more comments</button>
                </div>
            )
        }
        else {
            return(
                <div className="all-comments-container center-content">
                    {
                        this.state.commentsList.map((value, index) => {
                            //console.log(value);
                            return (
                                <OneComment key={index} comment={value}/>
                            )
                        })
                    }
                    {(!this.state.nomore && !this.state.comments_err) &&
                        <button className="button-as-link" onClick={this.seeMore}>Show more comments</button>                    
                    }
                </div>
            )
        }

        
    }
}

export default Comments;