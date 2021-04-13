import React from "react";
import './Comments.css';
import like_icon from './images/like.png';
import liked_icon from './images/liked.png';
import delete_icon from './images/delete-icon.png';
import Likes from './Likes';
import {getUsers, getPostsComments, getLikesSample, getAllLikes, LikeComment, UnLikeComment, DeleteComment, AddComment, getUser, UserLikesComment} from './api';
import ProfileCard from  './ProfileCard';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import OutsideClickHandler from 'react-outside-click-handler';
import { MentionsInput, Mention } from 'react-mentions'

class NewComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            username: null,
            photo: null,
            logged: this.props.logged,
            text: "",
            firstFocus: true,
            usersList: [],
            postId: this.props.postId,
            owner: this.props.owner,
            error: null,
        }
        this.handleInput = this.handleInput.bind(this);
        this.submit = this.submit.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.askTags = this.askTags.bind(this);
    }
    createNotification = (type, title="aaa", message="aaa") => {
        console.log("creating notification");
        console.log(type);
        store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: true
            }
          });
    };
    askTags = () => {
        if (this.state.firstFocus) {
            this.setState({
                firstFocus: false,
            })
            getUsers()
            .then(response => {
                console.log(response);
                let tempL = [];
                response.data.forEach(el => {
                    tempL.push({
                        "id": el.id,
                        "display": el.username,
                    })
                })
                this.setState({
                    usersList: tempL,
                })
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
    handleInput = (event) => {
        const value = event.target.value;
        this.setState({
            text: value,
        })
        console.log(`text: ${value}`)
    }
    submit = (event) => {
        event.preventDefault();
        if (this.state.text.length) {
            AddComment(this.state.userId, this.state.postId, this.state.text)
            .then(response => {
                console.log(response);
                this.props.updateComments();
                this.setState({
                    text: "",
                })
                this.createNotification('success', 'Hello,', 'Comment posted succesffully');
            })
            .catch(err => {
                console.log(err);
                this.createNotification('danger', 'Sorry,', 'Comment could not be posted');
            })
        }
        else {
            this.createNotification('danger', 'Sorry,', "A comment can't be empty");
        }
        
    }

    getUserInfo = () => {
        if (this.props.userId) {
            getUser(this.props.userId)
            .then(response => {
                console.log(response);
                this.setState({
                    username: response.data.username,
                    photo: response.data.photo,
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: "Not logged in."
                })
            })
        }
        else {
            this.setState({
                error: "Not logged in."
            })
        }
    }

    componentDidMount() {
        this.getUserInfo();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.userId!==this.props.userId ||
            prevProps.logged!==this.props.logged) {
                this.setState({
                    userId: this.props.userId,
                    logged: this.props.logged,
                })
                this.getUserInfo();            
            }
    }

    render() {
        if (this.state.logged) {
            return(
                <div className="comment-box flex-item-expand">
                    <div className="flex-layout">
                        <div className="user-photo-container-small">
                                <img className="user-photo" src={this.state.photo} alt="user profile" />
                        </div>
                        <div className="owner-name">{this.state.username}</div>
                    </div>
                    <div className="text-comment flex-layout">
                        <MentionsInput className="comment-textarea" name="text" placeholder="Add your comment here..." value={this.state.text} onChange={this.handleInput} onFocus={this.askTags}>
                            <Mention
                                trigger="@"
                                data={this.state.usersList}
                                className="mention-suggestions"
                            />
                        </MentionsInput>
                        <button className="my-button pagi-button" onClick={this.submit}>Add</button>
                    </div>
                </div>
            )   
        }
        else {
            return (
                <div className="error-message">
                    You have to create an account to post comments.
                </div>
            )
        }
    }
}

class CommentText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: this.props.parts,
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.parts!==this.props.parts) {
            this.setState({
                parts: this.props.parts,
            })
        }
    }
    render() {
        console.log("my parts");
        console.log(this.state.parts);
        if (this.state.parts.length) {
            return (
                this.state.parts.map((value, index) => {
                    if (value.tag.id && !value.dump) {
                        return(
                            <div key={index} className="flex-layout">
                                <div className="owner-name tag"
                                    onMouseEnter={this.cardShow}
                                    onMouseLeave={this.cardHide}>
                                    {value.tag.username}
                                    {this.state.showCard &&
                                        <ProfileCard id={value.tag.id}
                                                username={value.tag.username}
                                                moto="moto"
                                                photo="aa"
                                                position={"top-close"}/>
                                    }
                                </div>
                                <div>&nbsp;</div>
                            </div>
                        )
                    }
                    else if (value.tag.id && value.dump){
                        return(
                            <div key={index} className="flex-layout">
                                <div className="owner-name tag"
                                    onMouseEnter={this.cardShow}
                                    onMouseLeave={this.cardHide}>
                                    {value.tag.username}
                                    {this.state.showCard &&
                                        <ProfileCard id={value.tag.id}
                                                username={value.tag.username}
                                                moto="moto"
                                                photo="aa"
                                                position={"top-close"}/>
                                    }
                                </div>
                                {" "+value.dump+" "}
                            </div>
                        )
                    }
                    else {
                        return(
                            <div key={index}>
                                {value.dump+" "}
                            </div>
                        )
                    }
                })
            )
        }
        else {
            return(
                <div></div>
            )
        }
    }
}

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
                username: "Loading...",
                photo: null,
            },
            likes_error: null,
            likesShow: false,
            delete: false,
            showModal: false,
            showCard: false,
            showCard2: false,
            textParts: [],
            usersList: [],
        }
        this.likesSample = this.likesSample.bind(this);
        this.showLikes = this.showLikes.bind(this);
        this.checkLiked = this.checkLiked.bind(this);
        this.commentLike = this.commentLike.bind(this);
        this.commentUnLike = this.commentUnLike.bind(this);
        this.commentDelete = this.commentDelete.bind(this);
        this.preDelete = this.preDelete.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
        this.cardShow2 = this.cardShow2.bind(this);
        this.cardHide2 = this.cardHide2.bind(this);
        this.filterComment = this.filterComment.bind(this);
        this.getUsernames = this.getUsernames.bind(this);
    }

    getUsernames = () => {
        if (this.state.comment) {
            if (this.state.comment.text) {
                if (this.state.comment.text.includes('@[')) {
                    getUsers()
                    .then(response => {
                        console.log(response);
                        let tempUsersList = [];
                        response.data.forEach(el => {
                            tempUsersList.push(el.username)
                        })
                        this.setState({
                            usersList: tempUsersList,
                        })
                        setTimeout(()=>{this.filterComment();}, 500)
                    })
                    .catch(err => {
                        console.log(err);
                    })    
                }        
            }
        }
    }

    filterComment = () => {
        let comment_text = this.state.comment.text;
        let final_comment_object = [];
        comment_text = comment_text.replaceAll("@", " @");
        console.log(comment_text);
        let s2 = comment_text.trim().split(/\s+/);
        console.log(s2);
        s2.forEach(el => {
            console.log(el)
            if (el.startsWith('@')) {    
                this.state.usersList.forEach(sugg => {
                    if (el.startsWith(`@[${sugg}]`)) {
                        console.log(`el: ${el}`)
                        let el2 = el.split(')')
                        //console.log(`el parts: ${el2}`)
                        let first = el2[0]
                        let dump = el2[1]
                        //console.log(`first: ${first}`)
                        let username = first.split(']')[0].slice(2)
                        let id = first.split(']')[1].slice(1)
                        console.log(`username: ${username}`)
                        console.log(`id: ${id}`)
                        console.log(`dump: ${dump}`)
                        final_comment_object.push({
                            "tag": {
                                "username": username,
                                "id": id,
                            },
                            "dump": dump,
                        })
                    }
                })
            }
            else {
                final_comment_object.push({
                    "tag": {},
                    "dump": el,
                })
            }
        })
        console.log("FINAL COMMENT:")
        console.log(final_comment_object)
        this.setState({
            textParts: final_comment_object,
        })
    }


    createNotification = (type, title="aaa", message="aaa") => {
        console.log("creating notification");
        console.log(type);
        store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: true
            }
          });
    };
    cardShow = () => {
            this.setState({
                showCard: true,
            })
    }
    cardHide = () => {
            this.setState({
                showCard: false,
            })
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
            this.createNotification("success", "Hello,", "Comment deleted successfully")
            this.hideModal();
            this.props.updateParent(this.state.comment.id);
        })
        .catch(err => {
            console.log(err);
            this.hideModal();
            this.createNotification("danger", "Sorry,", "We couldn't delete your comment")
        })
    }
    commentLike = () => {
        if (!this.state.logged) {
            this.createNotification('danger', 'Sorry', 'You have to create an account to like a comment')
        }
        else {
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
    }
    likesSample = () => {
        setTimeout(()=> {}, 2000);
        if (this.state.comment.id) {
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
        else {
            this.setState({
                likes_error: "No likes found",
                likesNum: 0,
            })
        }
    }
    checkLiked = () => {
        if (this.state.logged) {
            setTimeout(()=> {}, 2000);
            UserLikesComment(this.state.userId, this.state.comment.id)
            .then(response => {
                console.log(response);
                this.setState({
                    liked: response.data.likes,
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    liked: false,
                })
            })
        }
    }
    componentDidMount() {
        console.log("I am one comment")
        this.likesSample();
        this.checkLiked();
        this.getUsernames();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.userId!==this.props.userId ||
            prevProps.logged!==this.props.logged ||
            prevProps.comment!==this.props.comment) {
                this.setState({
                    userId: this.props.userId,
                    logged: this.props.logged,
                    comment: this.props.comment,
                })
                if (!this.state.usersList.length) {
                    this.getUsernames();
                }
            }
    }

    render() {
        if (this.state.delete || !this.state.comment.text || !this.state.comment) {
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
                                <img className="user-photo" src={this.state.comment.owner.photo} alt="user profile" />
                        </div>
                        <div className="owner-name"
                            onMouseEnter={this.cardShow}
                            onMouseLeave={this.cardHide}>
                            {this.state.comment.owner.username}
                            {this.state.showCard &&
                                <ProfileCard id={this.state.comment.owner.id}
                                        username={this.state.comment.owner.username}
                                        moto={this.state.comment.owner.moto}
                                        photo={this.state.comment.owner.photo}
                                        position={"top-close"}/>
                            }
                        </div>
                        <div className="post-date comment-date">at {commentDatetime}</div>
                    </div>
                    <div className="text-comment flex-layout">
                        <CommentText parts={this.state.textParts} />                    
                    </div>
                    <div className="comment-like-container flex-layout">
                        <img className="like-icon" src={like_icon} alt="like-icon"/>
                        {this.state.likesNum>1 &&
                            <button className="liker-sample button-as-link " onClick={this.showLikes}>{this.state.likerSample.username} and {this.state.likesNum-1} more</button>
                        }
                        {this.state.likesNum===1 &&
                            <div className="liker-sample"
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
                            <div className="liker-sample">0</div>
                        }
                        {this.state.likesShow &&
                        <Likes id={this.state.comment.id}
                            userId={this.state.userId}
                            logged={this.state.logged}
                            liked={this.state.liked}
                            on="comment"
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
                                <img className="delete-icon" src={delete_icon} alt="like-icon"/>
                                <div>Delete</div>
                            </button>
                        }

                    </div>
                    {this.state.showModal && 
                        <OutsideClickHandler onOutsideClick={this.hideModal}>
                                <div className="comments-pop-up box-colors center-content">
                                    <div className="message center-content">
                                        Are you sure you want delete this comment?<br></br>
                                    </div>
                                    <div className="modal-buttons-container center-content flex-layout margin-top-small">
                                        <button className="my-button flex-item-small margin-top-small margin" onClick={this.hideModal}>No, I changed my mind</button>
                                        <button className="my-button flex-item-small margin-top-small margin" onClick={this.commentDelete}>Yes, delete anyway</button>                                        
                                    </div>
                                </div>
                        </OutsideClickHandler>
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
        this.updateMe = this.updateMe.bind(this);
    }
    updateMe = () => {
        setTimeout(()=>{
            this.setState({
                commentsList: [],
            })
            this.askComments();
            this.props.reTakeSample();
            if(this.state.how==="sample") {
                this.seeMore();
            }
        }, 1000);
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
        this.props.updateParent();
    }
    componentDidMount() {
        if (this.state.how==="sample") {
            ;
        }
        else {
            this.askComments();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId!==this.props.userId ||
            prevProps.logged!==this.props.logged ||
            prevProps.postId!==this.props.postId) {
                this.setState({
                    userId: this.props.userId,
                    logged: this.props.logged,
                    postId: this.props.postId,
                })
            }
    }

    render() {
        if (this.state.how==="sample") {
            return (
                <div className="all-comments-container center-content">
                    <NewComment userId={this.state.userId}
                                logged={this.state.logged}
                                postId={this.state.postId}
                                updateComments={this.updateMe}/>
                    {this.state.commentSample!==null &&
                                        <OneComment userId={this.state.userId}
                                        logged={this.state.logged}
                                        comment={this.state.commentSample}
                                        updateParent={this.removeComment}
                                        updateHome={this.props.updateHome}
                                        followsUpd={this.state.followsUpd}
                                        />        
                    }
                    {this.state.commentSample &&
                        <button className="button-as-link center-text" onClick={this.seeMore}>Show more comments</button>
                    }
                </div>
            )
        }
        else {
            return(
                <div className="all-comments-container center-content">
                    <NewComment userId={this.state.userId}
                                logged={this.state.logged}
                                postId={this.state.postId}
                                updateComments={this.updateMe}/>
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