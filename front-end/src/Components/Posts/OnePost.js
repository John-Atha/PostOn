import React, { useState, useEffect } from "react";
import "./Posts.css";
import { getUsers, getPostsCommentsSample, UpdatePostLike, getLikesSample,
         LikePost, UnLikePost, editPost, deletePost, UserLikesPost,
         DelPostTags, PostPostTag } from '../../api/api';
import like_icon from '../../images/like.png';
import liked_icon from '../../images/liked.png';
import comment_icon from '../../images/comment.png';
import edit_icon from '../../images/edit.png';
import delete_icon from '../../images/delete-blue.png';
import verified from '../../images/verified.png';
import Likes from '../Likes/Likes';
import Comments from '../Comments/Comments';
import ProfileCard from '../Profile/ProfileCard';
import OutsideClickHandler from 'react-outside-click-handler';
import { MentionsInput, Mention } from 'react-mentions';
import { createNotification } from '../../createNotification';
import Button from "react-bootstrap/esm/Button";
import PostText from './PostText';
import PostTextNoTags from './PostTextNoTags';

function OnePost(props) {

    const [user, setUser] = useState(props.user);
    const [logged, setLogged] = useState(props.user!==null);
    const [post, setPost] = useState(props.post);
    const [text, setText] = useState(props.post.text);
    const [textInit, setTextInit] = useState(props.post.text);
    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [likesNum, setLikesNum] = useState(0);
    const [likeKind, setLikeKind] = useState(null);
    const [likesKinds, setLikesKinds] = useState([]);
    const [commentsNum, setCommentsNum] = useState(0);
    const [followsUpd, setFollowsUpd] = useState(0);
    const [likerSample, setLikerSample] = useState({username: "Loading..."});
    const [commentSample, setCommentSample] = useState({owner: { username: "Loading..."} });
    const [commentsError, setCommentsError] = useState(null);
    const [showingLikes, setShowingLikes] = useState(false);
    const [showingComments, setShowingComments] = useState(true);
    const [editting, setEditting] = useState(false);
    const [showingCard, setShowingCard] = useState(false);
    const [showingCard2, setShowingCard2] = useState(false);
    const [showingModal, setShowingModal] = useState(false);
    const [textParts, setTextParts] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [usersList2, setUsersList2] = useState([]);
    const [firstFocus, setFirstFocus] = useState(true);
    const [showingReactions, setShowingReactions] = useState(false);

    const preLike = (kind) => {
        if (likeKind===kind) {
            postUnLike();
        }
        else {
            postLike(kind);
        }
        setShowingReactions(false);
    }

    const updateTags = () => {
        removeTags();
        addTags();
    }
    
    const removeTags = () => {
        DelPostTags(post.id)
        .then(()=> {
            ;
        })
        .catch(() => {
            ;
        })
    }

    const addTags = () => {
        textParts.forEach(obj => {
            if (obj.tag.id) {
                let object = {
                    "mentioned": {
                        "id":  obj.tag.id,
                    }
                }
                PostPostTag(post.id, object)
                .then(() => {
                    ;
                })
                .catch(() => {
                    ;
                })
            }
        })
    }

    const askTags = () => {
        if (firstFocus) {
            setFirstFocus(false);
            getUsers()
            .then(response => {
                let tempL = [];
                response.data.forEach(el => {
                    tempL.push({
                        "id": el.id,
                        "display": el.username,
                        "verified": el.verified,
                    })
                })
                setUsersList2(tempL);
            })
            .catch(() => {
                ;
            })
        }
    }

    const getUsernames = () => {
        if (text.includes('@[')) {
            getUsers()
            .then(response => {
                let tempUsersList = [];
                response.data.forEach(el => {
                    tempUsersList.push({
                        "id": el.id,
                        "username": el.username,
                        "photo": el.photo,
                        "moto": el.moto,
                    })
                })
                setUsersList(tempUsersList);
            })
            .catch(() => {
                ;
            })    
        }
    }

    const filterPost = () => {
        let post_text = textInit;
        let s3 = [];
        post_text = post_text.replaceAll(")@", ") @");
        // split on spaces
        let s2 = post_text.split(' ');
        s2 = s2.filter((word, index) => {
            return word!=='' && word!==' '
        })
        // split and add on new lines
        for (let i=0; i<s2.length; i++) {
            if (s2[i]==='\n') {
                s3.push('\n');
            }
            else if (s2[i].includes('\n')) {
                let subList = s2[i].split('\n');
                subList = subList.map(word => {
                    if (word==='') return '\n';
                    return word;
                })
                let index = 0;
                while (index<subList.length-1) {
                    if (subList[index]!=='\n' && subList[index+1]!=='\n') {
                        subList.splice(index+1, 0, '\n');
                    }
                    index++;
                }
                s3 = s3.concat(subList);    
            }
            else {
                s3.push(s2[i]);
            }            
        }
        const final_post_object = [];
        let index=0;
        s3.forEach(el => {
            if (el.startsWith('@')) {  
                let matched = false;
                usersList.forEach(suggest => {
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
                                "test": "test",
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
        setTextParts([])
        setTimeout(()=>setTextParts(final_post_object), 100);
    }

    /*checkLogged = () => {
        isLogged()
        .then(response => {
            setLogged(response.data.authenticated);
            setUserId(response.data.id);
            setTimeout(()=>{checkLiked();},500);
        })
        .catch(() => {
            setError("Not logged in");
        })
    }*/

    const checkLiked = () => {
        if (user) {
            UserLikesPost(user.id, post.id)
            .then(response => {
                //console.log(response);
                setLiked(response.data.likes);
                setLikeId(response.data.id);
                setLikeKind(response.data.kind);
            })
            .catch(() => {
                setLiked(false);
                setLikeId(null);
                setLikeKind(null);
            })
        }
        else {
            setLiked(false);
            setLikeId(null);
            setLikeKind(null);
        }
    }

    const hideModal = () => {
        setShowingModal(false);
    }

    const postDelete = () => {
        deletePost(post.id)
        .then(() => {
            createNotification("success", "Hello,", "Post deleted successfully")
            hideModal();
            props.updateParent("restart");
        })
        .catch(() => {
            hideModal();
            createNotification("danger", "Sorry,", "We couldn't delete your post")
        })
    }

    const discardText = () => {
        setEditting(false);
        setText(textInit);
        createNotification('warning', 'Hello,', 'Changes discarded successfully');
    }

    const saveText = () => {
        if (!text.length) {
            createNotification('warning', 'Sorry', 'You can\'t have an empty post' )
        }
        else {
            editPost(post.id, text)
            .then(() => {
                setEditting(false);
                setTextInit(text);
                createNotification('success', 'Hello,', 'Post changed succesffully');
                if (text.includes("@[")) {
                    setTimeout(()=>{updateTags();}, 100);
                }
                else {
                    getUsernames();
                    removeTags();
                }
            })
            .catch(() => {
                createNotification('danger', 'Sorry,', 'Post could not be updated');
            })
        }
    }

    const postUnLike = () => {
        UnLikePost(likeId)
        .then(() => {
            setLiked(false);
            setLikeId(null);
            setLikeKind(null);
            likesSample();
        })
        .catch(() => {
            ;
        })               
    }

    const postLike = (kind) => {
        if (!logged) {
            createNotification('danger', 'Sorry', 'You have to create an account to like a post')
        }
        else {
            if (liked) {
                UpdatePostLike(likeId, kind)
                .then(response=> {
                    setLiked(true);
                    setLikeKind(response.data.kind);
                    likesSample();
                })
                .catch(() => {
                    ;
                })
            }
            else {
                LikePost(user.id, post.id, kind)
                .then(response => {
                    setLiked(true);
                    setLikeId(response.data.id);
                    setLikeKind(response.data.kind);
                    likesSample();
                })
                .catch(() => {
                    ;
                })      
            }
        }
    }

    const showLikes = (event) => {
        setShowingLikes(true);
        setFollowsUpd(followsUpd+1);
    }

    const showHideComments = () => {
        setShowingComments(!showingComments)
    }

    const commentsSample = () => {
        //console.log("I am one-post class, I was called by my child")
        //console.log("I am taking comments sample.");
        getPostsCommentsSample(post.id)
        .then(response => {
            //console.log(response);
            setCommentsNum(response.data.comments);
            setCommentSample(response.data["one-comment"]);
        })
        .catch(() => {
            setCommentsNum(0);
            setCommentsError("No comments found");
            setCommentSample(null);
        })
    }

    const likesSample = () => {
        getLikesSample(post.id, "post")
        .then(response => {
            setLikesNum(response.data.likes);
            setLikerSample(response.data["one-liker"]);
            setLikesKinds(response.data.kinds);
        })
        .catch(() => {
            setLikesNum(0);
            setLikesKinds([]);
        })
    }

    const statsSample = () => {
        likesSample();
        commentsSample();
    }
  
    useEffect(() => {
        setUser(props.user);
        setLogged(props.user!==null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user])

    useEffect(() => {
        if (post) {
            checkLiked();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        setPost(props.post);
        setText(props.post.text);
        setTextInit(props.post.text);
        if (!usersList.length) {
            getUsernames();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.post])

    useEffect(() => {
        statsSample();
        if (user) {
            checkLiked();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post])

    useEffect(() => {
        filterPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersList, textInit])

        
    const dateCalc = () => {
        const d = new Date(post.date);
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
    
    const showImage = () => {
        props.setShowingMedia(true);
        props.setImage(post.media);
        props.setVideo(null);
    }
    
    /*const showVideo = () => {
        props.setShowingMedia(true);
        props.setVideo(post.video);
        props.setImage(null);
    }*/

    /*const resize = () => {
        const mediaUrl = post.media || post.video;
        const img = document.getElementById(mediaUrl);
        if (!Array(img.classList).includes('resized')) {
            const height = img.naturalHeight;
            const width = img.naturalWidth;
            img.classList.remove('post-media-square');
            img.classList.add(height>1.3*width ? 'post-media-tall' : 'post-media-square');
            img.classList.add('resized');
            console.log(`height: ${height}, width: ${width} => ${height>1.3*width ? "post-media-tall" : "post-media-square"}`);    
        }
        else {
            console.log('already resized');
        }
    }*/

    return(
        <div className={props.user ? "user-post-container" : "post-container"}>
            <div className="flex-layout">
                <div className="user-photo-container"
                                onMouseEnter={()=>setShowingCard(true)}
                                onMouseLeave={()=>setShowingCard(false)} >
                    <img className="user-photo" src={post.owner.photo} alt="user" />
                </div>
                <div onMouseEnter={()=>setShowingCard(true)}
                            onMouseLeave={()=>setShowingCard(false)}>
                    <div className="owner-name">
                        {post.owner.username}
                        {post.owner.verified===true &&
                            <img className="verified-icon" src={verified} alt="verified" />
                        }
                        {showingCard &&
                            <ProfileCard
                                user={post.owner}
                                position={"right"}
                            />
                        }
                    </div>
                    <div className="post-date">{dateCalc(post.date)}</div>
                </div>
                {(user?user.id:null)===post.owner.id &&
                    <div className="center-content flex-layout edit-action-container">
                        <button className="flex-layout button-as-link margin-right-small edit-action" onClick={()=>setEditting(true)}>
                                <img className="like-icon-small" src={edit_icon} alt="edit"/>
                                <div style={{'color': '#007bff'}}>Edit</div>
                        </button>
                        <button className="flex-layout button-as-link edit-action" onClick={()=>setShowingModal(true)}>
                                <img className="like-icon-small" src={delete_icon} alt="delete"/>
                                <div style={{'color': '#007bff'}}>Delete</div>
                        </button>
                    </div>
                }
            </div>
            <hr className="no-margin"></hr>
            {!editting &&
                <div className="post-body">
                    <div className="post-text flex-layout with-whitespace">
                        {text.includes('@[') && textParts.length!==0 &&
                            <PostText parts={textParts} />
                        }
                        {!text.includes('@[') && text.length!==0 &&
                            <PostTextNoTags text={text} />
                        }
                        {!text.length &&
                            <div></div>
                        }
                    </div>
                    {post.media &&
                        <div className="center-content" onClick={showImage}>
                                <img 
                                    src={post.media}
                                    alt="media"
                                    className='post-media'
                                    //onLoad={resize}
                                    //id={post.media}
                                />
                        </div>
                    }
                    {post.video &&
                        <div className="center-content">
                            <video
                                className='post-media'
                                //onLoad={resize}
                                //id={post.video}
                                controls>
                                <source src={post.video} />
                                Sorry, we couldn't display this video.
                            </video>
                        </div>
                    }
                </div>       
            }
            {editting &&
                <div className="post-body">
                    <MentionsInput className="post-textarea-edit margin-top-smaller" name="text" value={text} onChange={(event)=>setText(event.target.value)} onFocus={askTags}>
                        <Mention
                                trigger="@"
                                data={usersList2}
                                className="mention-suggestions"
                        />
                    </MentionsInput>
                    <div className="flex-layout center-content">
                        <Button variant='primary' className="margin" onClick={saveText}>Save change</Button>
                        <Button variant='outline-primary' className="margin" onClick={discardText}>Discard change</Button>
                    </div>                       
                    {post.media &&
                        <div className="center-content">
                                <img 
                                    //id={post.media}
                                    src={post.media}
                                    //onLoad={resize}
                                    className="post-media"
                                    alt="media"
                                />
                        </div>
                    }
                    {post.video &&
                        <div className="center-content">
                            <video 
                                //id={post.video}
                                //onLoad={resize}
                                className="post-media"
                                controls
                            >
                                <source src={post.video} />
                                Sorry, we couldn't display this video.
                            </video>
                        </div>
                    }
                </div>
            }
            <hr className="no-margin"></hr>
            <div className="stats-sample flex-layout">
                <div className="likes-sample flex-layout">
                    {likesNum===0 &&
                        <div style={{'marginTop': '5px'}}>&#128077;</div>
                    }
                    {likesKinds.includes('like') &&
                        <div style={{'marginTop': '5px'}}>&#128077;</div>
                    }
                    {likesKinds.includes('haha') &&
                        <div style={{'marginTop': '5px'}}>&#128514;</div>
                    }
                    {likesKinds.includes('love') &&
                        <div style={{'marginTop': '5px'}}>&#10084;&#65039;</div>
                    }
                    {likesKinds.includes('liquid') &&
                        <div style={{'marginTop': '5px'}}>💦</div>
                    }
                    {likesKinds.includes('sad') &&
                        <div style={{'marginTop': '5px'}}>&#128546;</div>
                    }
                    {likesKinds.includes('dislike') &&
                        <div style={{'marginTop': '5px'}}>&#128078;</div>
                    }
                    {likesNum>1 &&
                        <button className="liker-sample button-as-link-grey" onClick={showLikes}>{likerSample.username} and {likesNum-1} more</button>
                    }
                    {likesNum===1 &&
                        <div className="liker-sample button-as-link-grey"
                            style={{'marginTop': '7px'}}
                            onMouseEnter={()=>setShowingCard2(true)}
                            onMouseLeave={()=>setShowingCard2(false)}>

                            {likerSample.username}
                            {showingCard2 &&
                                <ProfileCard
                                    user={likerSample}
                                    position={"bottom"}
                                />
                            }
                        </div>
                    }
                    {!likesNum &&
                        <button disabled={true} className="liker-sample button-as-link-grey">0</button>
                    }
                </div>
                <div className="comments-sample flex-layout">
                    <div>&#9997;</div>
                    {commentsNum>1 && commentSample &&
                        <button className="likes-sample-num button-as-link-grey" onClick={showHideComments}>{commentSample.owner.username} and {commentsNum-1} more</button>
                    }
                    {commentsNum===1 && commentSample &&
                        <button className="likes-sample-num button-as-link-grey" onClick={showHideComments}>{commentSample.owner.username}</button>
                    }
                    {!commentsNum &&
                        <button disabled={true} className="likes-sample-num button-as-link-grey">0</button>
                    }
                </div>
            </div>
            <hr className="no-margin"></hr>
            <div className="post-actions center-content flex-layout">
            <OutsideClickHandler
                onOutsideClick={()=>{setShowingReactions(false)}}>
                <div className="center-content margin-side" 
                        style={{'position': 'relative', 'minWidth': '100px'}}>
                    {!liked &&
                        <button 
                            onClick={()=>setShowingReactions(true)}
                            className="likes-action flex-layout button-as-link">
                                <img className="like-icon" src={like_icon} alt="like-icon"/>
                                <div>Like</div>
                        </button>
                    }
                    {liked && likeKind==="like" &&
                        <button 
                            onClick={()=>setShowingReactions(true)}
                            className="likes-action flex-layout button-as-link">
                                <img className="like-icon" src={liked_icon} alt="liked-icon"/>
                                <div className="blue-color">Liked</div>
                        </button>
                    }
                    {liked && likeKind==="haha" &&
                        <button 
                            onClick={()=>setShowingReactions(true)}
                            className="likes-action flex-layout button-as-link">
                                <div>&#128514;</div>
                                <div style={{'color': '#edaf11'}}>Haha</div>
                        </button>
                    }         
                    {liked && likeKind==="love" &&
                        <button 
                            onClick={()=>setShowingReactions(true)}
                            className="likes-action flex-layout button-as-link">
                                <div>&#10084;&#65039;</div>
                                <div style={{'color': 'red'}}>Love</div>
                        </button>
                    }
                    {liked && likeKind==="liquid" &&
                        <button 
                            onClick={()=>setShowingReactions(true)}
                            className="likes-action flex-layout button-as-link">
                                <div>💦</div>
                                <div style={{'color': '#05b4ff'}}>Liquid</div>
                        </button>
                    }  
                    {liked && likeKind==="sad" &&
                        <button 
                            onClick={()=>setShowingReactions(true)}
                            className="likes-action flex-layout button-as-link">
                                <div>&#128546;</div>
                                <div style={{'color': '#065a96'}}>Sad</div>
                        </button>
                    }
                    {liked && likeKind==="dislike" &&
                        <button 
                            onClick={()=>setShowingReactions(true)}
                            className="likes-action flex-layout button-as-link">
                                <div>&#128078;</div>
                                <div style={{'color': '#b08415'}}>Disliked</div>
                        </button>
                    }
                    {showingReactions && 
                        <div className="reactions-box flex-layout center-content">
                            <button className="react-choice likes-action" onClick={()=>{preLike('like')}}>
                            <div>&#128077;</div>
                            </button>
                            <button className="react-choice likes-action" onClick={()=>{preLike('haha')}}>
                                <div>&#128514;</div>
                            </button>   
                            <button className="react-choice likes-action" onClick={()=>{preLike('love')}}>
                                <div>&#10084;&#65039;</div>
                            </button>   
                            <button className="react-choice likes-action" onClick={()=>{preLike('liquid')}}>
                                <div>💦</div>
                            </button>   
                            <button className="react-choice likes-action" onClick={()=>{preLike('sad')}}>
                                <div>&#128546;</div>
                            </button>   
                            <button className="react-choice likes-action" onClick={()=>{preLike('dislike')}}>
                                <div>&#128078;</div>
                            </button>   
                        </div>
                    }                                
                </div>
            </OutsideClickHandler>
                <div className="center-content margin-side">
                    <button className="comments-action flex-layout button-as-link" onClick={showHideComments}>
                        <img className="comment-icon" src={comment_icon} alt="comment-icon"/>
                            <div>Comment</div>
                    </button>
                </div>
            </div>
            {showingLikes &&
                <Likes id={post.id}
                    userId={user?user.id:null}
                    logged={logged}
                    on={"post"}
                    liked={liked}
                    updateHome={props.updateHome}
                    followsUpd={followsUpd}
                    showMe={true}
                    kinds={likesKinds}
                />
            }
            <hr className="no-margin"></hr>
            {showingComments &&
                <Comments user={user}
                        postId={post.id}
                        logged={logged}
                        how={"sample"}
                        sample={commentSample}
                        comments_error={commentsError}
                        updateParent={commentsSample}
                        updateHome={props.updateHome}
                        followsUpd={followsUpd}
                        reTakeSample={commentsSample}
                />
            }
            {showingModal && 
                <OutsideClickHandler onOutsideClick={hideModal}>
                    <div className="posts-pop-up box-colors center-content">
                        <div className="message center-content">
                            Are you sure you want delete this post?<br></br>
                        </div>
                        <div className="modal-buttons-container center-content margin-top-small">
                            <Button variant="primary" className="margin" onClick={hideModal}>No, I changed my mind</Button>
                            <Button variant="danger" className="margin" onClick={postDelete}>Yes, delete anyway</Button>                                        
                        </div>
                    </div>
                </OutsideClickHandler>
            }                
            
        </div>
    )
}

export default OnePost;