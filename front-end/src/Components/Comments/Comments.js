import React, { useState, useEffect } from "react";
import './Comments.css';
import { getPostsComments } from '../../api/api';
import OneComment from './OneComment';
import NewComment from './NewComment';

function Comments(props) {
    const [user, setUser] = useState(props.user);
    const [postId, setPostId] = useState(props.postId);
    const [start, setStart] = useState(1);
    const [commentsList, setCommentsList] = useState([]);
    const [show, setShow] = useState(false);
    const [commentsError, setCommentsError] = useState(props.comments_error);
    const [nomore, setNomore] = useState(false);

    const updateMe = () => {
        if (!show) {
            setShow(true);
        }
        if (start!==1) {
            setStart(1);
        }
        else {
            askComments();
        }
        props.reTakeSample();
    }

    const seeMore = () => {
        if (show) setStart(start+5);
        if (!show) setShow(true);
    }

    const askComments = () => {
        console.log(`I am asking comments from ${start} to ${start+4}`)
        getPostsComments(start, start+4, postId)
        .then(response => {
            if (start===1){
                setCommentsList(response.data);
            }
            else {
                console.log(`I see previous commentlist of length ${commentsList.length}`)
                setCommentsList(commentsList.concat(response.data));    
            }
            setNomore(response.data.length<5);
            setCommentsError(null);
        })
        .catch(() => {
            setCommentsError("No more comments found");
        })
    }

    const removeComment = () => {
        props.updateParent();
        updateMe();
    }

    useEffect(() => {
        setUser(props.user);
        setPostId(props.postId);
        setCommentsError(props.comments_error);
    }, [props.user, props.postId, props.comments_error])


    useEffect(() => {
        askComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start])


    return (
        <div className="all-comments-container center-content">
            <NewComment 
                user={user}
                postId={postId}
                updateComments={updateMe}
            />
            {show &&
                commentsList.map((value, index) => {
                    //console.log(value);
                    return (
                        <OneComment 
                            userId={user?user.id:null}
                            key={value.id}
                            comment={value}
                            updateParent={removeComment}
                            updateHome={props.updateHome}
                        />
                    )
                })
            }
            {((!show) || (show && !nomore)) && !commentsError &&
                <button className="button-as-link center-text" onClick={seeMore}>Show more comments</button>
            }
        </div>
    )

}

export default Comments;