import React from "react";
import "./Posts.css";
import { getUsers, getPostsCommentsSample, UpdatePostLike, getLikesSample,
         LikePost, UnLikePost, editPost, deletePost, UserLikesPost,
         isLogged, DelPostTags, PostPostTag } from '../../api/api';
import like_icon from '../../images/like.png';
import liked_icon from '../../images/liked.png';
import comment_icon from '../../images/comment.png';
import edit_icon from '../../images/edit.png';
import delete_icon from '../../images/delete-icon.png';
import verified from '../../images/verified.png';
import Likes from '../Likes/Likes';
import Comments from '../Comments/Comments';
import ProfileCard from '../Profile/ProfileCard';
import OutsideClickHandler from 'react-outside-click-handler';
import { MentionsInput, Mention } from 'react-mentions';
import ReactPlayer from 'react-player';
import { createNotification } from '../../createNotification';
import Button from "react-bootstrap/esm/Button";

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
        //console.log(s2);
        s3 = s3.flat();
        //console.log(s3);
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
                //console.log("is is an iframe")    
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
        //console.log("final filtered:")
        //console.log(copy.flat())
        this.setState({
            iframes: iframesTemp,
        })
        //console.log("iframes found:")
        //console.log(this.state.iframes)
        //console.log(iframesTemp)
    }
    componentDidMount() {
        this.filter1();
        //console.log("mou hrthe text:")
        //console.log(this.state.text)

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
        //console.log("I am a post with no tags and parts:")
        //console.log(this.state.parts);
        if (!(this.state.parts.length===1 && this.state.parts[0]===" ") && this.state.parts.length) {
            //console.log("I have length")
            return(
                <div style={{'width': '100%'}}>
                    <div className="flex-layout with-whitespace">
                        {this.state.parts.map((value, index) => {
                        //console.log(`part: ${value}`)
                            if (this.isUrl(value)) {
                                //console.log("I am a url")
                                    return(
                                        <a style={{'marginRight': '4px'}} key={index} target="_blank" rel="noreferrer noopener" className="post-url with-whitespace" 
                                        href={(value.endsWith(' ') || value.endsWith('\n')) ? value.slice(0, value.length-1) : value}>{value}</a>
                                    )
                            }
                            else if (value==='\n') {
                                //console.log("I am a new line")
                                return(
                                    <div key={index} className="break"></div>
                                )
                            }
                            else if (value === ' ') {
                                return null
                            }
                            else {
                                //console.log("I am a real string")
                                return(
                                    <div style={{'marginRight': '4px'}} key={index}>{value}</div>
                                )
                            }
                        })}
                    </div>
                    <div className="player-wrapper margin-top-small center-content">
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
            //console.log("my props where updated to:")
            //console.log(this.props.parts);
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
                //console.log(`found one at index ${i}:`)
                //console.log(this.state.parts[i]);
                additions.push(i+counter+1);
                counter++;
            }
        }
        let copy=this.state.parts.slice();
        copy.forEach(el => {
            //console.log(`checking ${el} from iframing`)
            if (el.dump.includes("https") && (el.dump.includes("youtu.be") || el.dump.includes("youtube"))) {
                //console.log("is is an iframe")    
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
        //console.log("NEW PARTS")
        //console.log(copy);
        this.setState({
            iframes: iframesTemp,
        })
        //console.log("iframes found:")
        //console.log(this.state.iframes)
        //console.log(iframesTemp)
    }

    render() {
        //console.log(this.state.parts);
        if (this.state.parts.length) {
            //console.log(`I am a post with parts:`)
            //console.log(this.state.parts)
            return (
                <div style={{'width': '100%'}}>
                    <div className="flex-layout with-whitespace">
                        {this.state.parts.map((value, index) => {
                            if (value.tag.id && !value.dump) {
                                return(
                                    <div key={index} style={{'marginRight': '4px'}} className="owner-name tag"
                                        onMouseEnter={()=>this.cardShow(index)}
                                        onMouseLeave={()=>this.cardHide(index)}>
                                        {value.tag.username}
                                        {this.state.showCard[index] &&
                                            <ProfileCard id={value.tag.id}
                                                    username={value.tag.username}
                                                    moto={value.tag.moto}
                                                    photo={value.tag.photo}
                                                    position={"top-close"}
                                                    verified={value.tag.verified}
                                                    />
                                        }
                                    </div>
                                )
                            }
                            else if (value.tag.id && value.dump){
                                return(
                                    <div key={index} className="flex-layout with-whitespace">
                                        <div className="owner-name tag" style={{'marginRight': '4px'}}
                                            onMouseEnter={()=>this.cardShow(index)}
                                            onMouseLeave={()=>this.cardHide(index)}>
                                            {value.tag.username}
                                            {this.state.showCard[index] &&
                                                <ProfileCard id={value.tag.id}
                                                        username={value.tag.username}
                                                        moto={value.tag.moto}
                                                        photo={value.tag.photo}
                                                        position={"top-close"}
                                                        verified={value.tag.verified} />
                                            }
                                        </div>
                                        { value.dump==='\n' &&
                                            <div className="break"></div>
                                        }
                                        { value.dump!=='\n' && value.dump!==' ' &&
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
                                                    //console.log("i am a url with tags")
                                                    return(
                                                        <a key={index} target="_blank" rel="noreferrer noopener" className="post-url with-whitespace" style={{'marginRight': '4px'}}
                                                        href={(value.endsWith(' ') || value.endsWith('\n')) ? value.slice(0,value.length-1) : value}>{value}</a>
                                                    )
                                                }
                                                else {
                                                    return(
                                                        <div style={{'marginRight': '4px'}} key={String(index)+String(value)}>
                                                            {value}
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
                                        <div key={index} style={{'marginRight': '4px'}}>
                                            {value.dump}
                                        </div>
                                    )
                                }
                                else {
                                    if (this.isUrl(value.dump)) {
                                        //console.log("I am a url with tags")
                                        return(
                                            <a key={index} target="_blank" rel="noreferrer noopener" className="post-url with-whitespace" style={{'marginRight': '4px'}}
                                            href={(value.dump.endsWith(' ') || value.dump.endsWith('\n')) ? value.dump.slice(0,value.dump.length-1) : value.dump}>{value.dump}</a>
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
                    <div className="player-wrapper margin-top-small center-content">
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
            //console.log("No parts")
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
            likeId: null,
            likesNum: 0,
            likeKind: null,
            likesKinds: [],
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
            showReactions: false,
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
        this.preLike = this.preLike.bind(this);
        this.dateCalc = this.dateCalc.bind(this);
    }
    preLike = (kind) => {
        if (this.state.likeKind===kind) {
            this.postUnLike();
        }
        else {
            //console.log(`I am reacting with ${kind}.`)
            this.postLike(kind);
        }
        this.setState({
            showReactions: false,
        })
    }
    updateTags = () => {
        //console.log("I am updating the tags");
        this.removeTags();
        setTimeout(()=>{this.addTags();}, 1000);
    }
    removeTags = () => {
        //console.log("I am removing the old tags")
        DelPostTags(this.state.id)
        .then(response=> {
            //console.log(response);
        })
        .catch(err => {
            //console.log(err);
        })
    }
    addTags = () => {
        //console.log("I am adding the new tags")
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
                        "verified": el.verified,
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
        //console.log("users i see")
        //console.log(this.state.usersList)
        //console.log("i am filter post");
        let post_text = this.state.text;
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
        //console.log(s2);
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
                        let el2 = el.split(')')
                        let dump = el2[1]
                        final_post_object.push({
                            "tag": {
                                "username": suggest.username,
                                "id": suggest.id,
                                "index": index,
                                "photo": suggest.photo,
                                "moto": suggest.moto,
                                "verified": suggest.verified,
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
                    likeId: response.data.id,
                    likeKind: response.data.kind,
                })
            })
            .catch(err => {
                //console.log(err);
                this.setState({
                    liked: false,
                    likeId: null,
                    likeKind: null,
                })
            })
        }
        else {
            this.setState({
                liked: false,
                likeId: null,
                likeKind: null,
            })
        }
    }
    preDelete = () => {
        //console.log("Chose to delete")
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
            createNotification("success", "Hello,", "Post deleted successfully")
            this.hideModal();
            this.props.updateParent("restart");
        })
        .catch(err => {
            //console.log(err);
            this.hideModal();
            createNotification("danger", "Sorry,", "We couldn't delete your post")
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
        createNotification('warning', 'Hello,', 'Changes discarded successfully');
    }
    saveText = () => {
        if (!this.state.text.length) {
            createNotification('warning', 'Sorry', 'You can\'t have an empty post' )
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
                createNotification('success', 'Hello,', 'Post changed succesffully');
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
                createNotification('danger', 'Sorry,', 'Post could not be updated');
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
        /*getAllLikes(1, this.state.id, "post")
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
        })*/
        UnLikePost(this.state.likeId)
        .then(response => {
            //console.log(response);
            this.setState({
                liked: false,
                likeId: null,
                likeKind: null,
            });
            this.likesSample();
        })
        .catch(err => {
            //console.log(err);
        })               
    }
    postLike = (kind) => {
        if (!this.state.logged) {
            createNotification('danger', 'Sorry', 'You have to create an account to like a post')
        }
        else {
            if (this.state.liked) {
                UpdatePostLike(this.state.likeId, kind)
                .then(response=> {
                    //console.log(response);
                    this.setState({
                        liked: true,
                        likeKind: response.data.kind,
                    })
                    this.likesSample();
                })
                .catch(err => {
                    //console.log(err);
                })
            }
            else {
                LikePost(this.state.userId, this.state.id, kind)
                .then(response => {
                    //console.log(response);
                    this.setState({
                        liked: true,
                        likeId: response.data.id,
                        likeKind: response.data.kind,
                    })
                    this.likesSample();
                })
                .catch(err => {
                    //console.log(err);
                })      
            }
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
        //console.log("I am one-post class, I was called by my child")
        setTimeout(()=> {}, 5000);
        //console.log("I am taking comments sample.");
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
                likesKinds: response.data.kinds,
            })
        })
        .catch(err => {
            //console.log(err);
            this.setState({
                likesNum: 0,
                likes_error: "No likes found",
                likesKinds: [],
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
            //console.log("NEW POST!!")
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
    dateCalc = () => {
        const d = new Date(this.state.date);
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
        //console.log("POST WITH TEXT")
        //console.log(this.state.text)
        return(
            <div className={this.props.user ? "user-post-container" : "post-container"}>
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
                            {this.state.owner.verified===true &&
                                <img className="verified-icon" src={verified} alt="verified" />
                            }
                            {this.state.showCard &&
                                <ProfileCard id={this.state.owner.id}
                                     username={this.state.owner.username}
                                     moto={this.state.owner.moto}
                                     photo={this.state.owner.photo}
                                     verified={this.state.owner.verified}
                                     position={"right"} />
                            }
                        </div>
                        <div className="post-date">{this.dateCalc(this.state.date)}</div>
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
                        {this.state.media &&
                            <div className="center-content">
                                    <img className="post-media" src={this.state.media} alt="media"/>
                            </div>
                        }
                        {this.state.video &&
                            <div className="center-content">
                                <video className="post-media" controls>
                                    <source src={this.state.video} />
                                    Sorry, we couldn't display this video.
                                </video>
                            </div>
                        }
                    </div>       
                }
                {this.state.edit &&
                    <div className="post-body">
                        <MentionsInput className="post-textarea-edit margin-top-smaller" name="text" value={this.state.text} onChange={this.handleInput} onFocus={this.askTags}>
                            <Mention
                                    trigger="@"
                                    data={this.state.usersList2}
                                    className="mention-suggestions"
                            />
                        </MentionsInput>
                        <div className="flex-layout center-content">
                            <Button variant='primary' className="margin" onClick={this.saveText}>Save change</Button>
                            <Button variant='warning' className="margin" onClick={this.discardText}>Discard change</Button>
                        </div>                       
                        {this.state.media &&
                            <div className="center-content">
                                    <img className="post-media" src={this.state.media} alt="media"/>
                            </div>
                        }
                        {this.state.video &&
                            <div className="center-content">
                                <video className="post-media" controls>
                                    <source src={this.state.video} />
                                    Sorry, we couldn't display this video.
                                </video>
                            </div>
                        }
                    </div>
                }
                <hr className="no-margin"></hr>
                <div className="stats-sample flex-layout">
                    <div className="likes-sample flex-layout">
                        {this.state.likesNum===0 &&
                            <div style={{'marginTop': '5px'}}>&#128077;</div>
                        }
                        {this.state.likesKinds.includes('like') &&
                            <div style={{'marginTop': '5px'}}>&#128077;</div>
                        }
                        {this.state.likesKinds.includes('haha') &&
                            <div style={{'marginTop': '5px'}}>&#128514;</div>
                        }
                        {this.state.likesKinds.includes('love') &&
                            <div style={{'marginTop': '5px'}}>&#10084;&#65039;</div>
                        }
                        {this.state.likesKinds.includes('liquid') &&
                            <div style={{'marginTop': '5px'}}>💦</div>
                        }
                        {this.state.likesKinds.includes('sad') &&
                            <div style={{'marginTop': '5px'}}>&#128546;</div>
                        }
                        {this.state.likesKinds.includes('dislike') &&
                            <div style={{'marginTop': '5px'}}>&#128078;</div>
                        }
                        {this.state.likesNum>1 &&
                            <button className="liker-sample button-as-link-grey" onClick={this.showLikes}>{this.state.likerSample.username} and {this.state.likesNum-1} more</button>
                        }
                        {this.state.likesNum===1 &&
                            <div className="liker-sample button-as-link-grey"
                                style={{'marginTop': '7px'}}
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
                            <button disabled={true} className="liker-sample button-as-link-grey">0</button>
                        }
                    </div>
                    <div className="comments-sample flex-layout">
                        <div>&#9997;</div>
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
                <OutsideClickHandler
                    onOutsideClick={()=>{this.setState({showReactions: false})}}>
                    <div className="center-content margin-side" 
                         style={{'position': 'relative', 'minWidth': '100px'}}>
                        {!this.state.liked &&
                            <button 
                                onClick={()=>{this.setState({showReactions: true})}}
                                className="likes-action flex-layout button-as-link">
                                    <img className="like-icon" src={like_icon} alt="like-icon"/>
                                    <div>Like</div>
                            </button>
                        }
                        {this.state.liked && this.state.likeKind==="like" &&
                            <button 
                                onClick={()=>{this.setState({showReactions: true})}}
                                className="likes-action flex-layout button-as-link">
                                    <img className="like-icon" src={liked_icon} alt="liked-icon"/>
                                    <div className="blue-color">Liked</div>
                            </button>
                        }
                        {this.state.liked && this.state.likeKind==="haha" &&
                            <button 
                                onClick={()=>{this.setState({showReactions: true})}}
                                className="likes-action flex-layout button-as-link">
                                    <div>&#128514;</div>
                                    <div style={{'color': '#edaf11'}}>Haha</div>
                            </button>
                        }         
                        {this.state.liked && this.state.likeKind==="love" &&
                            <button 
                                onClick={()=>{this.setState({showReactions: true})}}
                                className="likes-action flex-layout button-as-link">
                                    <div>&#10084;&#65039;</div>
                                    <div style={{'color': 'red'}}>Love</div>
                            </button>
                        }
                        {this.state.liked && this.state.likeKind==="liquid" &&
                            <button 
                                onClick={()=>{this.setState({showReactions: true})}}
                                className="likes-action flex-layout button-as-link">
                                    <div>💦</div>
                                    <div style={{'color': '#05b4ff'}}>Liquid</div>
                            </button>
                        }  
                        {this.state.liked && this.state.likeKind==="sad" &&
                            <button 
                                onClick={()=>{this.setState({showReactions: true})}}
                                className="likes-action flex-layout button-as-link">
                                    <div>&#128546;</div>
                                    <div style={{'color': '#065a96'}}>Sad</div>
                            </button>
                        }
                        {this.state.liked && this.state.likeKind==="dislike" &&
                            <button 
                                onClick={()=>{this.setState({showReactions: true})}}
                                className="likes-action flex-layout button-as-link">
                                    <div>&#128078;</div>
                                    <div style={{'color': '#b08415'}}>Disliked</div>
                            </button>
                        }
                        {this.state.showReactions && 
                            <div className="reactions-box flex-layout center-content">
                                <button className="react-choice likes-action" onClick={()=>{this.preLike('like')}}>
                                <div>&#128077;</div>
                                </button>
                                <button className="react-choice likes-action" onClick={()=>{this.preLike('haha')}}>
                                    <div>&#128514;</div>
                                </button>   
                                <button className="react-choice likes-action" onClick={()=>{this.preLike('love')}}>
                                    <div>&#10084;&#65039;</div>
                                </button>   
                                <button className="react-choice likes-action" onClick={()=>{this.preLike('liquid')}}>
                                    <div>💦</div>
                                </button>   
                                <button className="react-choice likes-action" onClick={()=>{this.preLike('sad')}}>
                                    <div>&#128546;</div>
                                </button>   
                                <button className="react-choice likes-action" onClick={()=>{this.preLike('dislike')}}>
                                    <div>&#128078;</div>
                                </button>   
                            </div>
                        }                                
                    </div>
                </OutsideClickHandler>
                    <div className="center-content margin-side">
                        <button className="comments-action flex-layout button-as-link" onClick={this.showHideComments}>
                            <img className="comment-icon" src={comment_icon} alt="comment-icon"/>
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
                        kinds={this.state.likesKinds}
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
                            <div className="modal-buttons-container center-content margin-top-small">
                                <Button variant="primary" className="margin" onClick={this.hideModal}>No, I changed my mind</Button>
                                <Button variant="danger" className="margin" onClick={this.postDelete}>Yes, delete anyway</Button>                                        
                            </div>
                        </div>
                    </OutsideClickHandler>
                }                
                
            </div>
        )
    }
}

export default OnePost;