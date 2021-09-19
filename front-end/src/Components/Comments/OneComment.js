import React, { useState, useEffect } from "react";
import './Comments.css';
import like_icon from '../../images/like.png';
import liked_icon from '../../images/liked.png';
import delete_icon from '../../images/delete-icon.png';
import verified from '../../images/verified.png';
import Likes from '../Likes/Likes';
import { getUsers, getLikesSample,
         getAllLikes, LikeComment, UnLikeComment,
         DeleteComment, UserLikesComment,} from '../../api/api';
import ProfileCard from  '../Profile/ProfileCard';
import OutsideClickHandler from 'react-outside-click-handler';
import { createNotification } from '../../createNotification';
import Button from "react-bootstrap/esm/Button";
import PostTextNoTags from '../Posts/PostTextNoTags';
import PostText from '../Posts/PostText';

function OneComment(props) {
    const [userId, setUserId] = useState(props.userId);
    const [comment, setComment] = useState(props.comment);
    const [likesNum, setLikesNum] = useState(0);
    const [liked, setLiked] = useState(false);
    const [followsUpd, setFollowsUpd] = useState(0);
    const [likerSample, setLikerSample] = useState({ username: "Loading...", photo: null });
    const [likesShow, setLikesShow] = useState(false);
    const [showingModal, setShowingModal] = useState(false);
    const [showingCard, setShowingCard] = useState(false);
    const [showingCard2, setShowingCard2] = useState(false);
    const [textParts, setTextParts] = useState([]);
    const [usersList, setUsersList] = useState([]);

    const getUsernames = () => {
        if (comment) {
            if (comment.text.includes('@[')) {
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
    }

    const filterComment = () => {
        let comment_text = comment.text;
        let s3 = [];
        comment_text = comment_text.replaceAll(")@", ") @");
        // split on spaces
        let s2 = comment_text.split(' ');
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
       
    const hideModal = () => {
        setShowingModal(false);
    }

    const commentDelete = () => {
        DeleteComment(comment.id)
        .then(() => {
            createNotification("success", "Hello,", "Comment deleted successfully")
            hideModal();
            props.updateParent();
        })
        .catch(() => {
            hideModal();
            createNotification("danger", "Sorry,", "We couldn't delete your comment")
        })
    }

    const commentLike = () => {
        if (!userId) {
            createNotification('danger', 'Sorry', 'You have to create an account to like a comment')
        }
        else {
            LikeComment(userId, comment.id)
            .then(() => {
                setLiked(true);
                likesSample();
            })
            .catch(() => {
                ;
            })
        }
    }

    const commentUnLike = () => {
        getAllLikes(1, comment.id, "comment")
        .then(response => {
            response.data.forEach(like => {
                if (like.owner.id===userId) {
                    UnLikeComment(like.id)
                    .then(() => {
                        setLiked(false);
                        likesSample();            
                    })
                    .catch(() => {
                        ;
                    })
                }
            })
        })
        .catch(() => {
            ;
        })
    }

    const showLikes = (event) => {
        setLikesShow(true);
        setFollowsUpd(followsUpd+1);
    }

    const likesSample = () => {
        if (comment.id) {
            getLikesSample(comment.id, "comment")
            .then(response => {
                setLikesNum(response.data.likes);
                setLikerSample(response.data['one-liker']);
            })
            .catch(() => {
                setLikesNum(0);
            })
        }
        /*else {
            setLikesNum(0);
        }*/
    }

    const checkLiked = () => {
        if (userId) {
            UserLikesComment(userId, comment.id)
            .then(response => {
                setLiked(response.data.likes);
            })
            .catch(() => {
                setLiked(false);
            })
        }
    }

    useEffect(() => {
        setComment(props.comment);
    }, [props.comment])

    useEffect(() => {
        getUsernames();
        checkLiked();
        likesSample();
        if (usersList.length) filterComment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment])

    useEffect(() => {
        checkLiked();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    useEffect(() => {
        setUserId(props.userId);
    }, [props.userId])

    useEffect(() => {
        if (comment) filterComment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersList])

    const dateCalc = (str) => {
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

    return (
        <div className="comment-box flex-item-expand">
            <div className="flex-layout">
                <div className="user-photo-container-small">
                        <img className="user-photo" src={comment.owner.photo} alt="user profile" />
                </div>
                <div className="owner-name"
                    onMouseEnter={()=>setShowingCard(true)}
                    onMouseLeave={()=>setShowingCard(false)}>
                    {comment.owner.username}
                    {comment.owner.verified===true &&
                        <img className="verified-icon" src={verified} alt="verified" />
                    }
                    {showingCard &&
                        <ProfileCard 
                            user={comment.owner}
                            position={"top-close"}
                        />
                    }
                </div>
                <div className="post-date comment-date">{dateCalc(comment.date)}</div>
            </div>
            <div className="text-comment flex-layout with-whitespace">
                {comment.text.includes('@[') && textParts.length!==0 &&
                    <PostText isComment={true} parts={textParts} />  
                }
                {!comment.text.includes('@[') && comment.text.length!==0 &&
                    <PostTextNoTags
                        isComment={true}
                        text={comment.text} 
                    />  
                }
                {!comment.text.length &&
                    <div></div>
                }                  
            </div>
            <div className="comment-like-container flex-layout">
                <img className="like-icon" src={like_icon} alt="like-icon"/>
                {likesNum>1 &&
                    <button className="liker-sample button-as-link " onClick={showLikes}>{likerSample.username} and {likesNum-1} more</button>
                }
                {likesNum===1 &&
                    <div className="liker-sample"
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
                    <div className="liker-sample">0</div>
                }
                {likesShow &&
                <Likes
                    id={comment.id}
                    userId={userId}
                    logged={userId!==null}
                    liked={liked}
                    on="comment"
                    updateHome={props.updateHome}
                    showMe={true} 
                    followsUpd={followsUpd}
                    kinds={['like']}
                />
                }
                <hr className="no-margin"></hr>
                {!liked &&
                    <button className="likes-action flex-layout button-as-link" onClick={commentLike}>
                                <img className="like-icon" src={like_icon} alt="like-icon"/>
                                <div>Like</div>
                    </button>
                }
                {liked &&
                    <button className="likes-action flex-layout button-as-link" onClick={commentUnLike}>
                                <img className="like-icon" src={liked_icon} alt="like-icon"/>
                                <div className="blue-color">Liked</div>
                    </button>
                }
                {props.comment.owner.id === props.userId &&
                    <button className="likes-action flex-layout button-as-link margin-left" onClick={()=>setShowingModal(true)}>
                        <img className="delete-icon" src={delete_icon} alt="like-icon"/>
                        <div>Delete</div>
                    </button>
                }

            </div>
            {showingModal && 
                <OutsideClickHandler onOutsideClick={hideModal}>
                        <div className="comments-pop-up box-colors center-content">
                            <h5 className="message center-content">
                                Are you sure you want delete this comment?
                            </h5>
                            <hr />
                            <div className="modal-buttons-container center-content margin-top-small">
                                <Button variant="primary" className="margin" onClick={hideModal}>No, I changed my mind</Button>
                                <Button variant="danger" className="margin" onClick={commentDelete}>Yes, delete anyway</Button>                                        
                            </div>
                        </div>
                </OutsideClickHandler>
            }
        </div>
    )
}

export default OneComment;