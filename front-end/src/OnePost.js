import React from "react";
import "./Posts.css";

import {isLogged, getPosts, getPostsCommentsSample, getAllLikes, getLikesSample, myLikes, LikePost, UnLikePost, editPost, getUsersPosts} from './api';
import user_icon from './images/user-icon.png'; 
import like_icon from './images/like.png';
import liked_icon from './images/liked.png';
import comment_icon from './images/comment.png';
import edit_icon from './images/edit.png';

import Likes from './Likes';

import Comments from './Comments';
import ProfileCard from './ProfileCard';
import Profile from "./Profile";

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
            text_init :this.props.text,
            date: this.props.date,
            liked: this.props.liked,
            likesNum: 0,
            commentsNum: 0,
            followsUpd: 0,
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
            edit: false,
            editPostError: null,
            editPostSuccess: null,
            showCard: false,
            showCard2: false,
        }
        this.likesSample = this.likesSample.bind(this);
        this.commentsSample = this.commentsSample.bind(this);
        this.statsSample = this.statsSample.bind(this);
        this.showLikes = this.showLikes.bind(this);
        this.showHideComments = this.showHideComments.bind(this);
        this.postLike = this.postLike.bind(this);
        this.postUnLike = this.postUnLike.bind(this);
        this.saveText = this.saveText.bind(this);
        this.discardText = this.discardText.bind(this);
        this.editText = this.editText.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.hideMessages = this.hideMessages.bind(this);
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
        this.cardShow2 = this.cardShow2.bind(this);
        this.cardHide2 = this.cardHide2.bind(this);
    }
    cardShow2 = () => {
        this.setState({
            showCard2: true,
        })
    }
    cardHide2 = () => {
            this.setState({
                showCard2: false,
            })
    }
    cardShow = () => {
        this.setState({
            mouseOutLink: false,
            mouseOutCard: false,
            showCard: true,
        })
    }
    cardHide = () => {
        this.setState({
            showCard: false,
        })
    }
    discardText = () => {
        this.setState({
            edit: false,
            text: this.state.text_init,
        })
    }
    hideMessages = () => {
        setTimeout(()=> {
            console.log("I am hiding the messages.");
            this.setState({
                editPostError: null,
                editPostSuccess: null,    
            })
        }, 2000);
    }
    saveText = () => {
        editPost(this.state.id, this.state.text)
        .then(response => {
            console.log(response);
            this.setState({
                edit: false,
                editPostError: null,
                editPostSuccess: "Post edited succesfully.",
                text_init: this.state.text,
            })
            this.hideMessages();
        })
        .catch(err => {
            console.log(err);
            this.setState({
                editPostSuccess: null,
                editPostError: "Sorry, could not update post."
            })
            this.hideMessages();
        })
    }
    editText = () => {
        this.setState({
            edit: true,
        })
    }
    handleInput  = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        })
        console.log(`${name}: ${value}`)
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
            followsUpd: this.state.followsUpd+1,
        })
    }
    showHideComments = () => {
        this.setState({
            commentsShow: !this.state.commentsShow,
        })
    }
    commentsSample = () => {
        console.log("I am one-post class, I was called by my child")
        setTimeout(()=> {}, 5000);
        console.log("I am taking comments sample.");
        getPostsCommentsSample(this.props.id)
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
        getLikesSample(this.props.id, "post")
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
                text_init: this.props.text,
                date: this.props.date,
                liked: this.props.liked    
            })
            this.statsSample();
        }
    }

    render() {
        let datetime = this.state.date!==null ? this.state.date.replace('T', ' ').replace('Z', '').split(' ') : null;
        let date = datetime!==null ? datetime[0] : null;
        let time = datetime!==null ? datetime[1] : null;
        return(
            <div className="post-container">
                <div className="flex-layout">
                    <div className="user-photo-container"
                                    onMouseEnter={this.cardShow}
                                    onMouseLeave={this.cardHide} >
                        <img className="user-photo" src={user_icon} alt="user profile" />
                    </div>
                    <div onMouseEnter={this.cardShow}
                             onMouseLeave={this.cardHide}>
                        <div className="owner-name">
                            {this.state.owner.username}
                            {this.state.showCard &&
                                <ProfileCard id={this.state.owner.id}
                                     username={this.state.owner.username}
                                     moto={this.state.owner.moto}
                                     photo={this.state.owner.photo}
                                     position={"right"} />
                            }

                        </div>
                        <div className="post-date">{time}<br></br>{date}</div>
                    </div>
                    {this.state.userId===this.state.owner.id &&
                        <div className="center-content flex-item-small edit-action">
                            <button className="edit-action flex-layout button-as-link" onClick={this.editText}>
                                    <img className="like-icon" src={edit_icon} alt="edit-icon"/>
                                    <div>Edit</div>
                            </button>
                        </div>
                    }
                </div>
                <hr className="no-margin"></hr>
                {!this.state.edit &&
                    <div className="post-text">
                        <div className="error-message">{this.state.editPostError}</div>
                        <div className="success-message">{this.state.editPostSuccess}</div>
                        <div className="post-text">{this.state.text}</div>
                    </div>       
                }
                {this.state.edit &&
                    <div className="post-text">
                        <textarea className="post-textarea-edit" name="text" value={this.state.text} onChange={this.handleInput}></textarea>
                        <div className="flex-layout center-conetnt">
                            <button className="my-button pagi-button flex-item-small" onClick={this.saveText}>Save change</button>
                            <button className="my-button pagi-button flex-item-small" onClick={this.discardText}>Discard change</button>
                        </div>                       
                    </div>
                }
                <hr className="no-margin"></hr>
                <div className="stats-sample flex-layout">
                    <div className="likes-sample flex-layout">
                        <img className="like-icon" src={like_icon} alt="like-icon"/>
                        {this.state.likesNum>1 &&
                            <button className="liker-sample button-as-link-grey" onClick={this.showLikes}>{this.state.likerSample.username} and {this.state.likesNum-1} more</button>
                        }
                        {this.state.likesNum===1 &&
                            <div className="liker-sample button-as-link-grey"
                                onMouseEnter={this.cardShow2}
                                onMouseLeave={this.cardHide2}>

                                {this.state.likerSample.username}
                                {this.state.showCard2 &&
                                    <ProfileCard id={this.state.likerSample.id}
                                            username={this.state.likerSample.username}
                                            moto={this.state.likerSample.moto}
                                            photo={this.state.likerSample.photo}
                                            position={"bottom"}/>
                                }
                            </div>
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
                        <button className="comments-action flex-layout button-as-link" onClick={this.showHideComments}>
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
                        updateHome={this.props.updateHome}
                        followsUpd={this.state.followsUpd}
                        showMe={true}
                    />
                }
                <hr className="no-margin"></hr>
                {this.state.commentsNum && this.state.commentsShow &&
                    <Comments userId={this.state.userId}
                            postId={this.state.id}
                            logged={this.state.logged}
                            how={"sample"}
                            sample={this.state.commentSample}
                            updateParent={this.commentsSample}
                            updateHome={this.props.updateHome}
                            followsUpd={this.state.followsUpd}
                    />
                }
            </div>
        )
    }
}

export default OnePost;