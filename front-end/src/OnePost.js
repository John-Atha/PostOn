import React from "react";
import "./Posts.css";
import {getUsers, getPostsCommentsSample, getAllLikes, getLikesSample, LikePost, UnLikePost, editPost, deletePost, UserLikesPost, isLogged} from './api';
import like_icon from './images/like.png';
import liked_icon from './images/liked.png';
import comment_icon from './images/comment.png';
import edit_icon from './images/edit.png';
import delete_icon from './images/delete-icon.png';
import Likes from './Likes';
import Comments from './Comments';
import ProfileCard from './ProfileCard';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import OutsideClickHandler from 'react-outside-click-handler';

class PostText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: this.props.parts,
            showCard: [],
        }
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
    }
    cardShow = (i) => {
        let temp = this.state.showCard.slice()
        temp[i] = true
        this.setState({
            showCard: temp,
        })
    }
    cardHide = (i) => {
        let temp = this.state.showCard.slice()
        temp[i] = false
            this.setState({
                showCard: temp,
            })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.parts!==this.props.parts) {
            this.setState({
                parts: this.props.parts,
            })
        }
    }
    componentDidMount() {
        if (this.state.parts.length) {
            if (this.state.parts[-1].tag) {
                if (this.state.parts[-1].tag.index) {
                    for (let i=0; i<this.state.parts[-1].tag.index; i++) {
                        this.state.showCard.push(false);
                    }
                }
            }
        }
    }

    render() {
        console.log(this.state.parts);
        if (this.state.parts.length) {
            console.log(`I am a post with parts:`)
            console.log(this.state.parts)
            return (
                this.state.parts.map((value, index) => {
                    if (value.tag.id && !value.dump) {
                        return(
                            <div key={index} className="flex-layout">
                                <div className="owner-name tag"
                                    onMouseEnter={()=>this.cardShow(index)}
                                    onMouseLeave={()=>this.cardHide(index)}>
                                    {value.tag.username}
                                    {this.state.showCard[index] &&
                                        <ProfileCard id={value.tag.id}
                                                username={value.tag.username}
                                                moto={value.tag.moto}
                                                photo={value.tag.photo}
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
                                    onMouseEnter={()=>this.cardShow(index)}
                                    onMouseLeave={()=>this.cardHide(index)}>
                                    {value.tag.username}
                                    {this.state.showCard[index] &&
                                        <ProfileCard id={value.tag.id}
                                                username={value.tag.username}
                                                moto={value.tag.moto}
                                                photo={value.tag.photo}
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
            console.log("No parts")
            return(
                <div></div>
            )
        }
    }

}


class OnePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
            id: this.props.id,
            owner: this.props.owner,
            media: this.props.media,
            text: this.props.text,
            text_init :this.props.text,
            date: this.props.date,
            liked: false,
            likesNum: 0,
            commentsNum: 0,
            followsUpd: 0,
            likerSample: {
                username: "Loading...",
            },
            commentSample: {
                owner: {
                    username: "Loading..."
                },
            },
            likes_error: null,
            comments_error: null,
            likesShow: false,
            commentsShow: true,
            edit: false,
            showCard: false,
            showCard2: false,
            delete: false,
            showModal: false,
            textParts: [],
            usersList: [],
            hasTag: false,
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
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
        this.cardShow2 = this.cardShow2.bind(this);
        this.cardHide2 = this.cardHide2.bind(this);
        this.postDelete = this.postDelete.bind(this);
        this.preDelete = this.preDelete.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.checkLiked = this.checkLiked.bind(this);
        this.checkLogged = this.checkLogged.bind(this);
        this.filterPost = this.filterPost.bind(this);
        this.getUsernames = this.getUsernames.bind(this);
    }
    getUsernames = () => {
        if (this.state.text.includes('@[')) {
            this.setState({
                hasTag: true,
            })
            getUsers()
            .then(response => {
                console.log(response);
                let tempUsersList = [];
                response.data.forEach(el => {
                    tempUsersList.push({
                        "id": el.id,
                        "username": el.username,
                        "photo": el.photo,
                        "moto": el.moto,
                    })
                })
                this.setState({
                    usersList: tempUsersList,
                })
                setTimeout(()=>{this.filterPost();}, 500)
            })
            .catch(err => {
                console.log(err);
            })    
        }
    }
    filterPost = () => {
        console.log("i am filter post");
        let post_text = this.state.text;
        let final_post_object = [];
        post_text = post_text.replaceAll("@", " @");
        console.log(post_text);
        let s2 = post_text.trim().split(/\s+/);
        console.log(s2);
        let index=0;
        s2.forEach(el => {
            console.log(el)
            if (el.startsWith('@')) {    
                let matched = false;
                this.state.usersList.forEach(suggest => {
                    let sugg=suggest.username;
                    if (el.startsWith(`@[${sugg}]`)) {
                        matched = true;
                        console.log(`el: ${el}`)
                        let el2 = el.split(')')
                        //console.log(`el parts: ${el2}`)
                        let first = el2[0]
                        let dump = el2[1]
                        //console.log(`first: ${first}`)
                        //let username = first.split(']')[0].slice(2)
                        //let id = first.split(']')[1].slice(1)
                        console.log(`username: ${suggest.username}`)
                        console.log(`id: ${suggest.id}`)
                        console.log(`dump: ${dump}`)
                        final_post_object.push({
                            "tag": {
                                "username": suggest.username,
                                "id": suggest.id,
                                "index": index,
                                "photo": suggest.photo,
                                "moto": suggest.moto,
                            },
                            "dump": dump,
                        })
                        index++;
                    }
                })
                if (matched===false) {
                    final_post_object.push({
                        "tag": {},
                        "dump": el,
                    })    
                }
            }
            else {
                final_post_object.push({
                    "tag": {},
                    "dump": el,
                })
            }
        })
        console.log("FINAL COMMENT:")
        console.log(final_post_object)
        this.setState({
            textParts: final_post_object,
        })
    }

    checkLogged = () => {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            })
            setTimeout(()=>{this.checkLiked();},500);
        })
        .catch(err => {
            console.log(err)
            this.setState({
                error: "Not logged in"
            })
        })
    }

    checkLiked = () => {
        if (this.state.userId) {
            UserLikesPost(this.state.userId, this.state.id)
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
        else {
            this.setState({
                liked: false,
            })
        }
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
    preDelete = () => {
        console.log("Chose to delete")
        this.setState({
            showModal: true,
        })
    }
    hideModal = () => {
        this.setState({
            showModal: false,
        })
    }
    postDelete = () => {
        deletePost(this.state.id)
        .then(response => {
            console.log(response);
            this.setState({
                delete: true,
            })
            this.createNotification("success", "Hello,", "Post deleted successfully")
            this.hideModal();
            this.props.updateParent();
        })
        .catch(err => {
            console.log(err);
            this.hideModal();
            this.createNotification("danger", "Sorry,", "We couldn't delete your post")
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
        this.createNotification('warning', 'Hello,', 'Changes discarded successfully');
    }
    saveText = () => {
        if (!this.state.text.length) {
            this.createNotification('warning', 'Sorry', 'You can\'t have an empty post' )
        }
        else {
            editPost(this.state.id, this.state.text)
            .then(response => {
                console.log(response);
                this.setState({
                    edit: false,
                    text_init: this.state.text,
                })
                this.createNotification('success', 'Hello,', 'Post changed succesffully');
            })
            .catch(err => {
                console.log(err);
                this.createNotification('danger', 'Sorry,', 'Post could not be updated');
            })
        }
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
            this.setState({
                liked: false,
            })    
            this.likesSample();
        })
        
    }
    postLike = () => {
        if (!this.state.logged) {
            this.createNotification('danger', 'Sorry', 'You have to create an account to like a post')
        }
        else {
            this.checkLiked();
            setTimeout(()=> {
                if (!this.state.liked) {
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
            },500)    
        }
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
                commentsNum: 0,
                comments_error: "No comments found",
                commentSample: null,
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
                likesNum: 0,
                likes_error: "No likes found",
            })
        })
    }
    statsSample = () => {
        this.likesSample();
        this.commentsSample();
    }
    componentDidMount() {
        this.checkLogged();
        this.statsSample();
        this.getUsernames();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.id!==this.props.id || 
            prevProps.logged!==this.props.logged || 
            prevProps.userId!==this.props.userId || 
            prevProps.owner!==this.props.owner||
            prevProps.media!==this.props.media ||
            prevProps.text!==this.props.text ||
            prevProps.date!==this.props.date) {
            console.log("NEW POST!!")
            this.checkLogged();
            this.setState({
                id: this.props.id,
                //logged: this.props.logged,
                //userId: this.props.userId,
                owner: this.props.owner,
                media: this.props.media,
                text: this.props.text,
                text_init: this.props.text,
                date: this.props.date,
            })
            this.statsSample();
            this.checkLiked();
            if (!this.state.usersList.length) {
                this.getUsernames();
            }
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
                        <img className="user-photo" src={this.state.owner.photo} alt="user" />
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
                        <div className="center-content flex-layout edit-action-container">
                            <button className="flex-layout button-as-link margin-right-small edit-action" onClick={this.editText}>
                                    <img className="like-icon-small" src={edit_icon} alt="edit"/>
                                    <div>Edit</div>
                            </button>
                            <button className="flex-layout button-as-link edit-action" onClick={this.preDelete}>
                                    <img className="like-icon-small" src={delete_icon} alt="delete"/>
                                    <div>Delete</div>
                            </button>
                        </div>
                    }
                </div>
                <hr className="no-margin"></hr>
                {!this.state.edit &&
                    <div className="post-body">
                        {this.state.media &&
                            <div className="center-content">
                                <img className="post-media" src={this.state.media} alt="media"/>
                            </div>
                        }
                        <div className="post-text">
                            {this.state.hasTag &&
                                <PostText parts={this.state.textParts} />
                            }
                            {!this.state.hasTag &&
                                this.state.text
                            }
                        </div>
                    </div>       
                }
                {this.state.edit &&
                    <div className="post-body">
                        {this.state.media &&
                            <div className="center-content">
                                <img className="post-media" src={this.state.media} alt="media" />
                            </div>
                        }
                        <textarea className="post-textarea-edit margin-top-smaller" name="text" value={this.state.text} onChange={this.handleInput}></textarea>
                        <div className="flex-layout center-content">
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
                    <div className="center-content margin-side">
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
                    <div className="center-content margin-side">
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
                {this.state.commentsShow &&
                    <Comments userId={this.state.userId}
                            postId={this.state.id}
                            logged={this.state.logged}
                            how={"sample"}
                            sample={this.state.commentSample}
                            updateParent={this.commentsSample}
                            updateHome={this.props.updateHome}
                            followsUpd={this.state.followsUpd}
                            reTakeSample={this.commentsSample}
                    />
                }
                {this.state.showModal && 
                    <OutsideClickHandler onOutsideClick={this.hideModal}>
                        <div className="posts-pop-up box-colors center-content">
                            <div className="message center-content">
                                Are you sure you want delete this post?<br></br>
                            </div>
                            <div className="modal-buttons-container center-content flex-layout margin-top-small">
                                <button className="my-button flex-item-small margin-top-small margin" onClick={this.hideModal}>No, I changed my mind</button>
                                <button className="my-button flex-item-small margin-top-small margin" onClick={this.postDelete}>Yes, delete anyway</button>                                        
                            </div>
                        </div>
                    </OutsideClickHandler>
                }                
                
            </div>
        )
    }
}

export default OnePost;