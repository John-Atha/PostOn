import React, { useState, useEffect } from "react";
import './Comments.css';
import verified_img from '../../images/verified.png';
import { getUsers, AddComment, PostCommentTag } from '../../api/api';
import { MentionsInput, Mention } from 'react-mentions';
import { createNotification } from '../../createNotification';
import Button from "react-bootstrap/esm/Button";

function NewComment(props) {
    const [user, setUser] = useState(props.user);
    const [text, setText] = useState("");
    const [firstFocus, setFirstFocus] = useState(true);
    const [usersList, setUsersList] = useState([]);
    const [postId, setPostId] = useState(props.postId);

    const askTags = () => {
        if (firstFocus) {
            setFirstFocus(false);
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
                setUsersList(tempL);
            })
            .catch(() => {
                ;
            })
        }
    }

    const filterComment = (commentId) => {
        let comment_text = text;
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

        // collect tags to post
        const final_post_object = [];
        s3.forEach(el => {
            if (el.startsWith('@')) {    
                usersList.forEach(suggest => {
                    let sugg=suggest.display;
                    if (el.startsWith(`@[${sugg}]`)) {
                        let el2 = el.split(')')
                        let dump = el2[1]
                        final_post_object.push({
                            "tag": {
                                "username": suggest.display,
                                "id": suggest.id,
                            },
                            "dump": dump,
                        })
                    }
                })
            }
        })
        addTags(final_post_object, commentId);
    }

    const addTags = (tagsToPost, commentId) => {
        tagsToPost.forEach(obj => {
            let id = obj.tag.id;
            let object = {
                "mentioned": {
                    "id": id,
                }
            }
            PostCommentTag(commentId, object)
            .then(() => {
                ;
            })
            .catch(() => {
                ;
            })
        })
    }

    const submit = (event) => {
        event.preventDefault();
        if (text.length && user) {
            AddComment(user.id, postId, text)
            .then(response => {
                //console.log(response);
                props.updateComments();
                filterComment(response.data.id);
                setText("");
                createNotification('success', 'Hello,', 'Comment posted succesffully');
            })
            .catch(err => {
                //console.log(err);
                createNotification('danger', 'Sorry,', 'Comment could not be posted');
            })
        }
        else {
            createNotification('danger', 'Sorry,', "A comment can't be empty");
        }
        
    }

    useEffect(() => {
        setUser(props.user);
    }, [props.user])

    useEffect(() => {
        setPostId(props.postId);
    }, [props.postId])
    
    if (user) {
        return(
            <div className="comment-box flex-item-expand">
                <div className="flex-layout">
                    <div className="user-photo-container-small">
                            <img className="user-photo" src={user.photo} alt="user profile" />
                    </div>
                    <div className="owner-name">
                        {user.username}
                        {user.verified===true &&
                            <img className="verified-icon" src={verified_img} alt="verified" />
                        }    
                    </div>
                </div>
                <div className="text-comment flex-layout">
                    <MentionsInput className="comment-textarea" name="text" placeholder="Add your comment here..." value={text} onChange={(event)=>setText(event.target.value)} onFocus={askTags}>
                        <Mention
                            trigger="@"
                            data={usersList}
                            className="mention-suggestions"
                        />
                    </MentionsInput>
                    <Button variant='outline-primary' style={{'marginLeft': '3px'}} onClick={submit}>Add</Button>
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

export default NewComment;