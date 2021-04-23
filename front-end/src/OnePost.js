import React from "react";
import "./Posts.css";
import {getUsers, getPostsCommentsSample, getAllLikes, getLikesSample, LikePost, UnLikePost, editPost, deletePost, UserLikesPost, isLogged, DelPostTags, PostPostTag} from './api';
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
import { MentionsInput, Mention } from 'react-mentions';
import ReactPlayer from 'react-player';

class PostTextNoTags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.text,
            parts: [],
            iframes: [],
        }
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
        //console.log(s2)
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
        let iframesTemp = [];
        copy.forEach(el => {
            //console.log(`checking ${el} from iframing`)
            if (el.includes("https") && (el.includes("youtu.be") || el.includes("youtube"))) {
                ////console.log("is is an iframe")    
                /*if (el.endsWith(' ') || el.endsWith('\n')) {
                        iframesTemp.push(el.slice(el.length-12, el.length-2));
                }
                else {*/
                    iframesTemp.push(el);
                //}
            }
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
            iframes: [],
        })
        ////console.log("final filtered:")
        ////console.log(copy.flat())
        this.setState({
            iframes: iframesTemp,
        })
        ////console.log("iframes found:")
        ////console.log(this.state.iframes)
        ////console.log(iframesTemp)
    }

    componentDidMount() {
        this.filter1();
        ////console.log("mou hrthe text:")
        ////console.log(this.state.text)

    }
    componentDidUpdate(prevProps) {
        if (prevProps.text!==this.props.text) {
            this.setState({
                text: this.props.text,
            })
            this.filter1();
        }
    }
    isUrl = (str) => {
        return str.startsWith("https://") || str.startsWith("http://");
    }
    render() {
        ////console.log("I am a post with no tags and parts:")
        //console.log(this.state.parts);
        if (!(this.state.parts.length===1 && this.state.parts[0]===" ") && this.state.parts.length) {
            ////console.log("I have length")
            return(
                <div>
                    <div className="flex-layout with-whitespace">
                        {this.state.parts.map((value, index) => {
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
                        })}
                    </div>
                    <div className="player-wrapper margin-top-small">
                        {this.state.iframes.map((value, index) => {
                            return(
                                <ReactPlayer url={value} key={index} className="react-player"/>
                            )
                        })}
                    </div>
                </div>
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

class PostText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: this.props.parts,
            showCard: [],
            iframes: [],
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
            ////console.log("my props where updated to:")
            ////console.log(this.props.parts);
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
        let iframesTemp = [];
        for (let i=0; i<this.state.parts.length; i++) {
            if (this.state.parts[i].tag.id && this.state.parts[i].dump==='\n') {
                ////console.log(`found one at index ${i}:`)
                ////console.log(this.state.parts[i]);
                additions.push(i+counter+1);
                counter++;
            }
        }
        let copy=this.state.parts.slice();
        copy.forEach(el => {
            ////console.log(`checking ${el} from iframing`)
            if (el.dump.includes("https") && (el.dump.includes("youtu.be") || el.dump.includes("youtube"))) {
                ////console.log("is is an iframe")    
                /*if (el.endsWith(' ') || el.endsWith('\n')) {
                        iframesTemp.push(el.slice(el.length-12, el.length-2));
                }
                else {*/
                    iframesTemp.push(el.dump);
                //}
            }
        })
        //let copy = this.state.parts.slice();
        additions.forEach(index => {
            copy.splice(index, 0, {"tag": {}, "dump": "\n"});
        })
        this.setState({
            parts: copy,
            iframes: [],
        })
        ////console.log("NEW PARTS")
        ////console.log(copy);
        this.setState({
            iframes: iframesTemp,
        })
        ////console.log("iframes found:")
        ////console.log(this.state.iframes)
        ////console.log(iframesTemp)
    }

    render() {
        ////console.log(this.state.parts);
        if (this.state.parts.length) {
            ////console.log(`I am a post with parts:`)
            ////console.log(this.state.parts)
            return (
                <div>
                    <div className="flex-layout with-whitespace">
                        {this.state.parts.map((value, index) => {
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
                                    <div key={index} className="flex-layout with-whitespace">
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
                                    ////console.log("text to be shown:")
                                    //console.log(text);
                                    return(
                                        text.map((value, index)=> {
                                            ////console.log("text value:")
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
                                                    ////console.log("i am a url with tags")
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
                                        ////console.log("I am a url with tags")
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
                        })}
                    </div>
                    <div className="player-wrapper margin-top-small">
                        {this.state.iframes.map((value, index) => {
                            return(
                                <ReactPlayer url={value} key={index} className="react-player"/>
                            )
                        })}
                    </div>
                </div>
            )
        }
        else {
            ////console.log("No parts")
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
            video: this.props.video,
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
            usersList2: [],
            hasTag: false,
            firstFocus: true,
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
        this.askTags = this.askTags.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.removeTags = this.removeTags.bind(this);
        this.addTags = this.addTags.bind(this);
    }

    updateTags = () => {
        ////console.log("I am updating the tags");
        this.removeTags();
        setTimeout(()=>{this.addTags();}, 1000);
    }
    removeTags = () => {
        ////console.log("I am removing the old tags")
        DelPostTags(this.state.id)
        .then(response=> {
            //console.log(response);
        })
        .catch(err => {
            //console.log(err);
        })
    }
    addTags = () => {
        ////console.log("I am adding the new tags")
        this.state.textParts.forEach(obj => {
            if (obj.tag.id) {
                let object = {
                    "mentioned": {
                        "id":  obj.tag.id,
                    }
                }
                PostPostTag(this.state.id, object)
                .then(response => {
                    //console.log(response);
                })
                .catch(err => {
                    //console.log(err);
                })
            }
        })
    }
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
                    })
                })
                this.setState({
                    usersList2: tempL,
                })
            })
            .catch(err => {
                //console.log(err);
            })
        }
    }
    getUsernames = () => {
        if (this.state.text.includes('@[')) {
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
                setTimeout(()=>{this.filterPost();}, 500)
            })
            .catch(err => {
                //console.log(err);
            })    
        }
    }
    filterPost = () => {
        ////console.log("users i see")
        //console.log(this.state.usersList)
        ////console.log("i am filter post");
        let post_text = this.state.text;
        ////console.log("initial text")
        let final_post_object = [];
        let s3 = [];
        post_text = post_text.replaceAll(")@", ") @");
        //console.log(post_text);
        //let s2 = post_text.trim().split(/\s+/);
        let s2 = post_text.split(' ');
        for (let i=0; i<s2.length; i++) {
            s2[i]+=' ';
        }
        ////console.log("after fixing spaces")
        //console.log(s2)
        for (let i=0; i<s2.length; i++) {
            if (s2[i]!==[' ']) {
                ////console.log("sublist")
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
        ////console.log("BROKEN LIST")
        ////console.log(s2);
        s3 = s3.flat();
        ////console.log(s3);
        let index=0;
        s3.forEach(el => {
            ////console.log(el)
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
                        ////console.log(`username: ${suggest.username}`)
                        ////console.log(`id: ${suggest.id}`)
                        ////console.log(`dump: ${dump}`)
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
        ////console.log("FINAL COMMENT:")
        //console.log(final_post_object)
        this.setState({
            textParts: final_post_object,
        })
    }
    checkLogged = () => {
        isLogged()
        .then(response => {
            //console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            })
            setTimeout(()=>{this.checkLiked();},500);
        })
        .catch(err => {
            //console.log(err)
            this.setState({
                error: "Not logged in"
            })
        })
    }
    checkLiked = () => {
        if (this.state.userId) {
            UserLikesPost(this.state.userId, this.state.id)
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
        else {
            this.setState({
                liked: false,
            })
        }
    }
    createNotification = (type, title="aaa", message="aaa") => {
        ////console.log("creating notification");
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
    preDelete = () => {
        ////console.log("Chose to delete")
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
            //console.log(response);
            this.setState({
                delete: true,
            })
            this.createNotification("success", "Hello,", "Post deleted successfully")
            this.hideModal();
            this.props.updateParent("restart");
        })
        .catch(err => {
            //console.log(err);
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
                //console.log(response);
                this.setState({
                    edit: false,
                    text_init: this.state.text,
                })
                //console.log(`new text: ${this.state.text}`)
                this.createNotification('success', 'Hello,', 'Post changed succesffully');
                if (this.state.text.includes("@[")) {
                    this.filterPost()
                    setTimeout(()=>{this.updateTags();}, 1000);
                }
                else {
                    this.getUsernames();
                    this.removeTags();
                }
            })
            .catch(err => {
                //console.log(err);
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
        const value = event.target.value;
        this.setState({
            text: value,
        })
        //console.log(`text: ${value}`)
    }
    postUnLike = () => {
        getAllLikes(1, this.state.id, "post")
        .then(response => {
            //console.log(response);
            response.data.forEach(like => {
                if(like.owner.id===this.state.userId) {
                    UnLikePost(like.id)
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
        ////console.log("I am one-post class, I was called by my child")
        setTimeout(()=> {}, 5000);
        ////console.log("I am taking comments sample.");
        getPostsCommentsSample(this.props.id)
        .then(response => {
            //console.log(response);
            this.setState({
                commentsNum: response.data.comments,
                commentSample: response.data["one-comment"],
            })
        })
        .catch(err => {
            //console.log(err);
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
            //console.log(response);
            this.setState({
                likesNum: response.data.likes,
                likerSample: response.data["one-liker"],
            })
        })
        .catch(err => {
            //console.log(err);
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
            prevProps.video!==this.props.video ||
            prevProps.text!==this.props.text ||
            prevProps.date!==this.props.date) {
            ////console.log("NEW POST!!")
            this.checkLogged();
            this.setState({
                id: this.props.id,
                //logged: this.props.logged,
                //userId: this.props.userId,
                owner: this.props.owner,
                media: this.props.media,
                video: this.props.video,
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
        ////console.log("POST WITH TEXT")
        ////console.log(this.state.text)
        ////console.log(this.state.media)
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
                        {this.state.video && 
                            <video className="post-media" controls>
                                <source src={this.state.video} />
                                Sorry, we couldn't display this video.
                            </video>
                        }
                        <div className="post-text flex-layout with-whitespace">
                            {this.state.text.includes('@[') && this.state.textParts.length!==0 &&
                                <PostText parts={this.state.textParts} />
                            }
                            {!this.state.text.includes('@[') && this.state.text.length!==0 &&
                                <PostTextNoTags text={this.state.text} />
                            }
                            {!this.state.text.length &&
                                <div></div>
                            }
                        </div>
                    </div>       
                }
                {this.state.edit &&
                    <div className="post-body">
                        {this.state.media &&
                            <div className="center-content">
                                    <img className="post-media" src={this.state.media} alt="media"/>
                            </div>
                        }
                        {this.state.video && 
                            <video className="post-media" controls>
                                <source src={this.state.video} />
                                Sorry, we couldn't display this video.
                            </video>
                        }
                        <MentionsInput className="post-textarea-edit margin-top-smaller" name="text" value={this.state.text} onChange={this.handleInput} onFocus={this.askTags}>
                        <Mention
                                trigger="@"
                                data={this.state.usersList2}
                                className="mention-suggestions"
                            />
                        </MentionsInput>
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
                            comments_error={this.state.comments_error}
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