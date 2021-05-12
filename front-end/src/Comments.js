import React from "react";
import './Comments.css';
import like_icon from './images/like.png';
import liked_icon from './images/liked.png';
import delete_icon from './images/delete-icon.png';
import verified from './images/verified.png';
import Likes from './Likes';
import {getUsers, getPostsComments, getLikesSample, getAllLikes, LikeComment, UnLikeComment, DeleteComment, AddComment, getUser, UserLikesComment, PostCommentTag} from './api';
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
            verified: false,
            photo: null,
            logged: this.props.logged,
            text: "",
            firstFocus: true,
            usersList: [],
            postId: this.props.postId,
            owner: this.props.owner,
            error: null,
            tagsToPost: [],
            newId: null,
        }
        this.handleInput = this.handleInput.bind(this);
        this.submit = this.submit.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.askTags = this.askTags.bind(this);
        this.filterComment = this.filterComment.bind(this);
        this.addTags = this.addTags.bind(this);
    }
    createNotification = (type, title="aaa", message="aaa") => {
        //console.log("creating notification");
        //console.log(type);
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
                //console.log(response);
                let tempL = [];
                response.data.forEach(el => {
                    tempL.push({
                        "id": el.id,
                        "display": el.username,
                        "verified": el.verified,
                    })
                })
                this.setState({
                    usersList: tempL,
                })
            })
            .catch(err => {
                //console.log(err);
            })
        }
    }
    filterComment = (text) => {
        //console.log("users i see")
        //console.log(this.state.usersList)
        //console.log("i am filter comment");
        let post_text = text;
        //console.log("initial text")
        let final_post_object = [];
        let s3 = [];
        post_text = post_text.replaceAll(")@", ") @");
        //console.log(post_text);
        //let s2 = post_text.trim().split(/\s+/);
        let s2 = post_text.split(' ');
        for (let i=0; i<s2.length; i++) {
            s2[i]+=' ';
        }
        //console.log("after fixing spaces")
        //console.log(s2)
        for (let i=0; i<s2.length; i++) {
            if (s2[i]!==[' ']) {
                //console.log("sublist")
                //console.log(s2[i])
                let subList = s2[i].split('\n');
                //console.log(subList)
                if (subList.length>1) {
                    for (let j=0; j<subList.length-1; j++) {
                        if (!subList[j].endsWith('\n')) {
                            subList[j]+='\n';
                        }    
                        s3.push(subList[j]);
                    }
                    s3.push(subList[subList.length-1])
                }
                else {
                    s3.push(subList);
                }
            }
        }
        //console.log("BROKEN LIST")
        ////console.log(s2);
        s3 = s3.flat();
        //console.log(s3);
        let index=0;
        s3.forEach(el => {
            //console.log(el)
            if (el.startsWith('@')) {    
                let matched = false;
                this.state.usersList.forEach(suggest => {
                    let sugg=suggest.display;
                    if (el.startsWith(`@[${sugg}]`)) {
                        matched = true;
                        //console.log(`el: ${el}`)
                        let el2 = el.split(')')
                        ////console.log(`el parts: ${el2}`)
                        let first = el2[0]
                        let dump = el2[1]
                        ////console.log(`first: ${first}`)
                        //let username = first.split(']')[0].slice(2)
                        //let id = first.split(']')[1].slice(1)
                        //console.log(`username: ${suggest.display}`)
                        //console.log(`id: ${suggest.id}`)
                        //console.log(`dump: ${dump}`)
                        final_post_object.push({
                            "tag": {
                                "username": suggest.display,
                                "id": suggest.id,
                                "verified": suggest.verified,
                            },
                            "dump": dump,
                        })
                        index++;
                    }
                })
            }
        })
        //console.log("Tags to post:")
        //console.log(final_post_object)
        this.setState({
            tagsToPost: final_post_object,
        })
    }

    addTags = (text) => {
        // gets post id from: this.state.newId
        // gets tagsList from: this.state.tagsToPost
        this.filterComment(text);
        setTimeout(()=> {
            this.state.tagsToPost.forEach(obj => {
                let id = obj.tag.id;
                let object = {
                    "mentioned": {
                        "id": id,
                    }
                }
                PostCommentTag(this.state.newId, object)
                .then(response => {
                    //console.log(response);
                })
                .catch(err => {
                    //console.log(err);
                })
            })
        }, 200)
    }

    handleInput = (event) => {
        const value = event.target.value;
        this.setState({
            text: value,
        })
        //console.log(`text: ${value}`)
    }
    submit = (event) => {
        event.preventDefault();
        if (this.state.text.length) {
            AddComment(this.state.userId, this.state.postId, this.state.text)
            .then(response => {
                //console.log(response);
                this.props.updateComments();
                let prevText = this.state.text;
                this.setState({
                    text: "",
                    newId: response.data.id,
                })
                setTimeout(()=>{this.addTags(prevText);}, 1000);
                this.createNotification('success', 'Hello,', 'Comment posted succesffully');
            })
            .catch(err => {
                //console.log(err);
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
                //console.log(response);
                this.setState({
                    username: response.data.username,
                    photo: response.data.photo,
                    verified: response.data.verified,
                })
            })
            .catch(err => {
                //console.log(err);
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
                        <div className="owner-name">
                            {this.state.username}
                            {this.state.verified===true &&
                                <img className="verified-icon" src={verified} alt="verified" />
                            }
                        </div>
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

class CommentTextNoTags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.text,
            parts: [],
        }
        this.filter = this.filter.bind(this);
        this.filter1 = this.filter1.bind(this);
        this.filter2 = this.filter2.bind(this);
        this.isUrl = this.isUrl.bind(this);
    }
    filter1 = () => {
        let s3 = [];
        let s2 = this.state.text.split(' ');
        for (let i=0; i<s2.length; i++) {
            s2[i]+=' ';
        }
        ////console.log("after fixing spaces")
        ////console.log(s2)
        for (let i=0; i<s2.length; i++) {
            if (s2[i]!==[' ']) {
                ////console.log("sublist")
                ////console.log(s2[i])
                let subList = s2[i].split('\n');
                ////console.log(subList)
                if (subList.length>1) {
                    for (let j=0; j<subList.length-1; j++) {
                        if (!subList[j].endsWith('\n')) {
                            subList[j]+='\n';
                        }    
                        s3.push(subList[j]);
                    }
                    s3.push(subList[subList.length-1])
                }
                else {
                    s3.push(subList);
                }
            }
        }
        ////console.log("BROKEN LIST")
        ////console.log(s2);
        s3 = s3.flat();
        ////console.log(s3);
        this.setState({
            parts: s3,
        })    
        setTimeout(()=>{this.filter2();}, 500);
    }
    filter2 = () => {
        let copy = this.state.parts.slice()
        copy.forEach(el => {
            if (el!=='\n' && el!==' ') {
                if (el.endsWith('\n')) {
                    let index = copy.indexOf(el);
                    copy[index] = [el.slice(0, el.length-1), '\n']                
                }
                else if (el.endsWith(' ')) {
                    let index = copy.indexOf(el);
                    copy[index] = [el.slice(0, el.length-1), ' ']                 
                }    
            }
        })
        this.setState({
            parts: copy.flat(),
        })
        ////console.log("final filtered:")
        ////console.log(copy.flat())
    }
    filter = () => {
        this.filter1();
    }
    componentDidMount() {
        this.filter();
        ////console.log("mou hrthe text:")
        ////console.log(this.state.text)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.text!==this.props.text) {
            this.setState({
                text: this.props.text,
            })
            this.filter();
        }
    }
    isUrl = (str) => {
        return str.startsWith("https://") || str.startsWith("http://");
    }
    render() {
        ////console.log("I am a comment with no tags and parts:")
        ////console.log(this.state.parts);
        if (!(this.state.parts.length===1 && this.state.parts[0]===" ") && this.state.parts.length) {
            ////console.log("I have length")
            return(
                this.state.parts.map((value, index) => {
                    ////console.log(`part: ${value}`)
                        if (this.isUrl(value)) {
                            ////console.log("I am a url")
                                return(
                                    <a key={index} target="_blank" rel="noreferrer noopener" className="post-url with-whitespace" 
                                       href={(value.endsWith(' ') || value.endsWith('\n')) ? value.slice(0, value.length-1) : value}>{value+ " "}</a>
                                )
                        }
                        else if (value===' ') {
                            ////console.log("I am a space")
                            return(
                                <div key={index}>&nbsp;</div>
                            )
                        }
                        else if (value==='\n') {
                            ////console.log("I am a new line")
                            return(
                                <div key={index} className="break"></div>
                            )
                        }
                        else if (value==='') {
                            ////console.log("I am nothing")
                            return(
                                <div key={index}>NOTHING</div>
                            )
                        }
                        else {
                            ////console.log("I am a real string")
                            return(
                                <div key={index}>{value}</div>
                            )
                        }
                })
            )
        }
        /*if (false) {
            return(
                <div>oo</div>
            )
        }*/
        else {
            return(
                <div>aaa</div>
            )
        }
    }


}

class CommentText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: this.props.parts,
            showCard: [],
        }
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
        this.updateList = this.updateList.bind(this);
        this.isUrl = this.isUrl.bind(this);
    }
    isUrl = (str) => {
        return str.startsWith("https://") || str.startsWith("http://");
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
                parts: [],
            })
            setTimeout( ()=> {
                this.setState({
                    parts: this.props.parts,
                });
                this.updateList();    
            }, 100)
        }
    }
    componentDidMount() {
        if (this.state.parts.length) {
            if (this.state.parts[this.state.parts.length-1].tag) {
                if (this.state.parts[this.state.parts.length-1].tag.index) {
                    for (let i=0; i<this.state.parts[this.state.parts.length-1].tag.index; i++) {
                        this.state.showCard.push(false);
                    }
                }
            }
        }
        this.updateList();
    }

    updateList = () => {
        let additions = []
        let counter = 0
        for (let i=0; i<this.state.parts.length; i++) {
            if (this.state.parts[i].tag.id && this.state.parts[i].dump==='\n') {
                //console.log(`found one at index ${i}:`)
                //console.log(this.state.parts[i]);
                additions.push(i+counter+1);
                counter++;
            }
        }
        let copy = this.state.parts.slice();
        additions.forEach(index => {
            copy.splice(index, 0, {"tag": {}, "dump": "\n"});
        })
        this.setState({
            parts: copy,
        })
        //console.log("NEW PARTS")
        //console.log(copy);
    }


    render() {
        if (this.state.parts.length) {
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
                                                verified={value.tag.verified}
                                                position={"top-close"}/>
                                    }
                                </div>
                                <div>&nbsp;</div>
                            </div>
                        )
                    }
                    else if (value.tag.id && value.dump){
                        return(
                            <div key={index} className="flex-layout with-whitespace">
                                <div className="owner-name tag"
                                    onMouseEnter={()=>this.cardShow(index)}
                                    onMouseLeave={()=>this.cardHide(index)}>
                                    {value.tag.username}
                                    {this.state.showCard[index] &&
                                        <ProfileCard id={value.tag.id}
                                                username={value.tag.username}
                                                moto={value.tag.moto}
                                                verified={value.tag.verified}
                                                photo={value.tag.photo}
                                                position={"top-close"}/>
                                    }
                                </div>
                                { value.dump==='\n' &&
                                    <div className="break"></div>
                                
                                }
                                { value.dump!=='\n' &&
                                    <div>
                                        {value.dump}
                                    </div>
                                }
                                    
                            </div>
                        )
                    }
                    else {
                        let text = value.dump;
                        if (text.endsWith('\n')) {
                            text = text.split('\n');
                            //console.log("text to be shown:")
                            //console.log(text);
                            return(
                                text.map((value, index)=> {
                                    //console.log("text value:")
                                    //console.log(value);
                                    if (value==="") {
                                        return(
                                            <div key={String(index)+String(value)}
                                                className="break">
                                            </div>
                                        )
                                    }
                                    else {
                                        if (this.isUrl(value)) {
                                            //console.log("I am a url")
                                            return(
                                                <a key={index} target="_blank" rel="noreferrer noopener" className="post-url with-whitespace"
                                                   href={(value.endsWith(' ') || value.endsWith('\n')) ? value.slice(0,value.length-1) : value}>{value+" "}</a>
                                            )
                                        }
                                        else {
                                            return(
                                                <div key={String(index)+String(value)}>
                                                    {value+" "}
                                                </div>
                                            )
                                        }
                                    }
                                })
                            )
                        }
                        else if (text.includes('\n')) {
                            text = text.split('\n');
                            return(
                                <div key={index}>
                                    {value.dump+" "}
                                </div>
                            )
                        }
                        else {
                            if (this.isUrl(value.dump)) {
                                //console.log("I am a url")
                                return(
                                    <a key={index} target="_blank" rel="noreferrer noopener" className="post-url with-whitespace" 
                                       href={(value.dump.endsWith(' ') || value.dump.endsWith('\n')) ? value.dump.slice(0,value.dump.length-1) : value.dump}>{value.dump+" "}</a>
                                )
                            }
                            else {
                                return(
                                    <div key={index}>
                                        {value.dump}
                                    </div>
                                )    
                            }
                        }
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
            hasTag: false,
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
        this.dateCalc = this.dateCalc.bind(this);
    }

    getUsernames = () => {
        if (this.state.comment) {
            if (this.state.comment.text) {
                if (this.state.comment.text.includes('@[')) {
                    this.setState({
                        hasTag: true,
                    })
                    getUsers()
                    .then(response => {
                        //console.log(response);
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
                        setTimeout(()=>{this.filterComment();}, 500)
                    })
                    .catch(err => {
                        //console.log(err);
                    })    
                }        
            }
        }
    }
    filterComment = () => {
        //console.log("i am filter post");
        let comment_text = this.state.comment.text;
        //console.log("initial text")
        let final_post_object = [];
        let s3 = [];
        comment_text = comment_text.replaceAll(")@", ") @");
        //console.log(comment_text);
        //let s2 = comment_text.trim().split(/\s+/);
        let s2 = comment_text.split(' ');
        for (let i=0; i<s2.length; i++) {
            s2[i]+=' ';
        }
        //console.log("after fixing spaces")
        //console.log(s2)
        for (let i=0; i<s2.length; i++) {
            if (s2[i]!==[' ']) {
                //console.log("sublist")
                //console.log(s2[i])
                let subList = s2[i].split('\n');
                //console.log(subList)
                if (subList.length>1) {
                    for (let j=0; j<subList.length-1; j++) {
                        if (!subList[j].endsWith('\n')) {
                            subList[j]+='\n';
                        }    
                        s3.push(subList[j]);
                    }
                    s3.push(subList[subList.length-1])
                }
                else {
                    s3.push(subList);
                }
            }
        }
        //console.log("BROKEN LIST")
        ////console.log(s2);
        s3 = s3.flat();
        //console.log(s3);
        let index=0;
        s3.forEach(el => {
            //console.log(el)
            if (el.startsWith('@')) {    
                let matched = false;
                this.state.usersList.forEach(suggest => {
                    let sugg=suggest.username;
                    if (el.startsWith(`@[${sugg}]`)) {
                        matched = true;
                        //console.log(`el: ${el}`)
                        let el2 = el.split(')')
                        ////console.log(`el parts: ${el2}`)
                        let first = el2[0]
                        let dump = el2[1]
                        ////console.log(`first: ${first}`)
                        //let username = first.split(']')[0].slice(2)
                        //let id = first.split(']')[1].slice(1)
                        //console.log(`username: ${suggest.username}`)
                        //console.log(`id: ${suggest.id}`)
                        //console.log(`dump: ${dump}`)
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
        //console.log("FINAL COMMENT:")
        //console.log(final_post_object)
        this.setState({
            textParts: final_post_object,
        })
    }
    createNotification = (type, title="aaa", message="aaa") => {
        //console.log("creating notification");
        //console.log(type);
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
            //console.log(response);
            this.setState({
                delete: true,
            })
            this.createNotification("success", "Hello,", "Comment deleted successfully")
            this.hideModal();
            this.props.updateParent(this.state.comment.id);
        })
        .catch(err => {
            //console.log(err);
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
                //console.log(response);
                this.setState({
                    liked: true,
                })
                this.likesSample();
            })
            .catch(err => {
                //console.log(err);
            })
        }
    }
    commentUnLike = () => {
        getAllLikes(1, this.state.comment.id, "comment")
        .then(response => {
            //console.log(response);
            response.data.forEach(like => {
                if (like.owner.id===this.state.userId) {
                    UnLikeComment(like.id)
                    .then(response => {
                        //console.log(response);
                        this.setState({
                            liked: false,
                        })
                        this.likesSample();            
                    })
                    .catch(err => {
                        //console.log(err);
                    })
                }
            })
        })
        .catch(err => {
            //console.log(err);
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
                //console.log(response);
                this.setState({
                    likesNum: response.data.likes,
                    likerSample: response.data["one-liker"],
                })
            })
            .catch(err => {
                //console.log(err);
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
                //console.log(response);
                this.setState({
                    liked: response.data.likes,
                })
            })
            .catch(err => {
                //console.log(err);
                this.setState({
                    liked: false,
                })
            })
        }
    }
    componentDidMount() {
        //console.log("I am one comment")
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
    dateCalc = (str) => {
        const d = new Date(str);
        const now = new Date();
        const diff = new Date(now.getTime()-d.getTime())
        const years = diff.getFullYear()-1970
        const months = diff.getMonth()
        if (years>1) {
            return `${years*12+months} months ago`;
        }
        else if (years===1) {
            return 'last year';
        }
        else /* if (years===0) */ {
            if (months>1) {
                return `${months} months ago`;
            }
            else if (months===1) {
                return 'last month';
            }
            else /* if (months===0) */ {
                const days = diff.getDate()-1
                if (days>1) {
                    return `${days} days ago`;
                }
                else if (days===1) {
                    const hours = d.getHours()<10 ? `0${d.getHours()}` : d.getHours();
                    const minutes = d.getMinutes()<10 ? `0${d.getMinutes()}` : d.getMinutes();
                    const seconds = d.getSeconds()<10 ? `0${d.getSeconds()}` : d.getSeconds();
                    return `yesterday at ${hours}:${minutes}:${seconds}`;
                }
                else /* if (days===0) */ {
                    const hours = diff.getHours()-2;
                    if (hours>1) {
                        return `${hours} hours ago`;
                    }
                    else if (hours===1) {
                        return '1 hour ago';
                    }
                    else /* (if hours===0) */ {
                        const minutes = diff.getMinutes();
                        if (minutes>1) {
                            return `${minutes} minutes ago`;
                        }
                        else if (minutes===1) {
                            return '1 minute ago';
                        }
                        else {
                            return 'right now';
                        }
                    }
                }
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
                commentDatetime = this.dateCalc(this.state.comment.date);
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
                            {this.state.comment.owner.verified===true &&
                                <img className="verified-icon" src={verified} alt="verified" />
                            }
                            {this.state.showCard &&
                                <ProfileCard id={this.state.comment.owner.id}
                                        username={this.state.comment.owner.username}
                                        moto={this.state.comment.owner.moto}
                                        photo={this.state.comment.owner.photo}
                                        verified={this.state.comment.owner.verified}
                                        position={"top-close"}/>
                            }
                        </div>
                        <div className="post-date comment-date">{commentDatetime}</div>
                    </div>
                    <div className="text-comment flex-layout with-whitespace">
                        {this.state.comment.text.includes('@[') && this.state.textParts.length!==0 &&
                            <CommentText parts={this.state.textParts} />  
                        }
                        {!this.state.comment.text.includes('@[') && this.state.comment.text.length!==0 &&
                            <CommentTextNoTags text={this.state.comment.text} />  
                        }
                        {!this.state.comment.text.length &&
                            <div></div>
                        }                  
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
                                        verified={this.state.likerSample.verified}
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
                            kinds={['like']}
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
            comments_error: this.props.comments_error,
            commentsSize: 1,
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
                start: 1,
                end: 5,
            })
            this.props.reTakeSample();
            if(this.state.how==="sample") {
                this.seeMore();
            }
            else {
                setTimeout(()=>{this.askComments();}, 200);
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
            //console.log(`I am asking comments from ${this.state.start} to ${this.state.end}`)
            if (this.state.start===1) {
                this.setState({
                    commentsList: [],
                })
            }
            getPostsComments(this.state.start, this.state.end, this.state.postId)
            .then(response => {
                //console.log(response);
                this.setState({
                    commentsList: this.state.commentsList.concat(response.data),
                    nomore: response.data.length<5,
                    comments_error: null,
                })
                //console.log(this.state.commentsList.concat(response.data))
            })
            .catch(err => {
                //console.log(err);
                this.setState({
                    comments_error: "No more comments found",
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
            prevProps.postId!==this.props.postId ||
            prevProps.comments_error!==this.props.comments_error) {
                this.setState({
                    userId: this.props.userId,
                    logged: this.props.logged,
                    postId: this.props.postId,
                    comments_error: this.props.comments_error,
                })
            }
        if (prevProps.sample!==this.props.sample) {
            this.setState({
                start: 1,
                end: 5,
            })
            //this.askComments();
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
                    {!this.state.comments_error &&
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
                            ////console.log(value);
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
                    {(!this.state.nomore && !this.state.comments_error) &&
                        <button className="button-as-link" onClick={this.seeMore}>Show more comments</button>                    
                    }
                </div>
            )
        }
    }
}

export default Comments;