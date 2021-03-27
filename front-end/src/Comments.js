import React from "react";
import './Comments.css';

import user_icon from './images/user-icon.png'; 
import like_icon from './images/like.png';
import liked_icon from './images/liked.png';
import delete_icon from './images/delete-icon.png';

import Likes from './Likes';
import {getPostsComments, getLikesSample, getLikes, getAllLikes, LikeComment, UnLikeComment, DeleteComment} from './api';


class OneComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            comment: this.props.comment,
            mine: this.props.comment.owner.id===this.props.userId,
            likesNum: 0,
            liked: false,
            followsUpd: 0,
            likerSample: {
                username: "Loading..."
            },
            likes_error: null,
            likesShow: false,
            delete: false,
            showModal: false,
        }
        this.likesSample = this.likesSample.bind(this);
        this.showLikes = this.showLikes.bind(this);
        this.checkLiked = this.checkLiked.bind(this);
        this.commentLike = this.commentLike.bind(this);
        this.commentUnLike = this.commentUnLike.bind(this);
        this.commentDelete = this.commentDelete.bind(this);
        this.preDelete = this.preDelete.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    preDelete = () => {
        this.setState({
            showModal: true,
        })
    }

    hideModal = () => {
        this.setState({
            showModal: false,
        })
    }

    commentDelete = () => {
        DeleteComment(this.state.comment.id)
        .then(response => {
            console.log(response);
            this.setState({
                delete: true,
            })
            this.hideModal();
            let x = this.props.updateParent(this.state.comment.id);
        })
        .catch(err => {
            console.log(err);
            this.hideModal();
        })
    }

    commentLike = () => {
        LikeComment(this.state.userId, this.state.comment.id)
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

    commentUnLike = () => {
        getAllLikes(1, this.state.comment.id, "comment")
        .then(response => {
            console.log(response);
            response.data.forEach(like => {
                if (like.owner.id===this.state.userId) {
                    UnLikeComment(like.id)
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

    showLikes = (event) => {
        this.setState({
            likesShow: true,
            followsUpd: this.state.followsUpd+1,
        })
        /*let box = event.target.parentElement;
        let children = box.children;
        if (children[2]) {
            const container = children[2];
            if (container.children[0]) {
                container.children[0].style.display="block";
            }
            else {
                container.style.display="block";
            }
        }*/
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
                likesNum: 0,
            })
        })

    }

    checkLiked = () => {
        if (this.state.logged) {
            setTimeout(()=> {}, 2000);
            console.log(`I am asking likes from ${this.state.start} to ${this.state.end}.`);
            getLikes(this.state.start, this.state.end, this.state.comment.id, "comment")
            .then(response => {
                console.log(response);
                let tempLikersList = [];
                response.data.forEach(like => {
                    tempLikersList.push(like.owner.id);
                })
                this.setState({
                    liked: tempLikersList.includes(this.state.userId),
                    error: null,
                })
                console.log("liked "+ this.state.liked)
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: "No likes found."
                })
            })
        }
    }

    componentDidMount() {
        this.likesSample();
        this.checkLiked();
    }

    render() {
        if (this.state.delete) {
            return(
                <div></div>
            )
        }
        else {
            let commentDatetime = null;
            if (this.state.comment.owner.username!=="Loading...") {
                commentDatetime = this.state.comment.date.replace('T', ' ').replace('Z', '')
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
                            liked={this.state.liked}
                            on={"comment"}
                            updateHome={this.props.updateHome}
                            showMe={true} 
                            followsUpd={this.state.followsUpd}
                        />
                        }
                        <hr className="no-margin"></hr>
                        {!this.state.liked &&
                            <button className="likes-action flex-layout button-as-link" onClick={this.commentLike}>
                                        <img className="like-icon" src={like_icon} alt="like-icon"/>
                                        <div>Like</div>
                            </button>
                        }
                        {this.state.liked &&
                            <button className="likes-action flex-layout button-as-link" onClick={this.commentUnLike}>
                                        <img className="like-icon" src={liked_icon} alt="like-icon"/>
                                        <div className="blue-color">Liked</div>
                            </button>
                        }
                        {this.state.mine &&
                            <button className="likes-action flex-layout button-as-link margin-left" onClick={this.preDelete}>
                                <img className="like-icon" src={delete_icon} alt="like-icon"/>
                                <div>Delete</div>
                            </button>
                        }

                    </div>
                    {
                            this.state.showModal===true && 
                                <div className="comments-pop-up box-colors">
                                    <div className="message center-content">
                                        Are you sure you want delete this comment?<br></br>
                                    </div>
                                    <div className="modal-buttons-container center-content flex-layout margin-top-small">
                                        <button className="my-button flex-item margin-top-small" onClick={this.hideModal}>No, I changed my mind</button>
                                        <button className="my-button flex-item margin-top-small" onClick={this.commentDelete}>Yes, delete anyway</button>                                        
                                    </div>
                                </div>
                        
                    }
                
                </div>
            )
        }
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
        this.removeComment = this.removeComment.bind(this);
    }

    
    seeMore = () => {
        setTimeout(this.setState({
            start: this.state.how==="sample" ? 1 : this.state.start+5,
            end: this.state.how==="sample" ? 5 :this.state.end+5,
            how: "all",
        }), 0)
        setTimeout(() => this.askComments(), 0);    
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

    removeComment = (id) => {
        console.log(`I will delete comment ${id}`)
        let commIndex = null;
        if (this.state.how==="sample") {
            console.log(`I am looking for it at he comments list:`)
            console.log([this.state.commentSample])
            this.setState({
                commentsList: [],
            })
            console.log("New comments list: []")
        }
        else {
            console.log(`I am looking for it at he comments list:`)
            console.log(this.state.commentsList)
            this.state.commentsList.forEach(comment => {
                if (comment.id===id) {
                    console.log(`Found comment at index ${this.state.commentsList.indexOf(comment)}`)
                    commIndex = this.state.commentsList.indexOf(comment);
                }
            })
            let tempCommentsList = this.state.commentsList;
            tempCommentsList.splice(commIndex, 1);
            console.log("New comments list:")
            console.log(tempCommentsList);
            this.setState({
                commentsList: tempCommentsList,
            })
        }
        let x = this.props.updateParent();
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
                    <OneComment userId={this.state.userId}
                                logged={this.state.logged}
                                comment={this.state.commentSample}
                                updateParent={this.removeComment}
                                updateHome={this.props.updateHome}
                                followsUpd={this.state.followsUpd}
                                />
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
                                <OneComment userId={this.state.userId}
                                            logged={this.state.logged}
                                            key={index}
                                            comment={value}
                                            updateParent={this.removeComment}
                                            updateHome={this.props.updateHome}
                                            followsUpd={this.state.followsUpd}
                                            />
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