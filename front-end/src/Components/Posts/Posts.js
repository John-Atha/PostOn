import React, { useState, useEffect } from "react";
import "./Posts.css";
import { getUsers, getPosts, getUsersPosts, PostPostText,
         PostPostPhoto, deletePost, PostPostTag } from '../../api/api';
import OnePost from '../Posts/OnePost';
import arrow_icon from '../../images/arrow-up.png';
import { MentionsInput, Mention } from 'react-mentions'
import { createNotification } from '../../createNotification';
import Button from "react-bootstrap/esm/Button";
import Spinner from 'react-bootstrap/esm/Spinner';

function Posts(props) {

    const [user, setUser] = useState(props.user);
    const [postsList, setPostsList] = useState([]);
    const [start, setStart] = useState(1);
    const [newText, setNewText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [firstFocus, setFirstFocus] = useState(true);
    const [tagsToPost, setTagsToPost] = useState([]);
    const [newId, setNewId] = useState(null);
    const [nomore, setNomore] = useState(false);
    const [asked, setAsked] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [restarted, setRestarted] = useState(false);

    const checkScroll = () => {
            if (isLoading) return;
            console.log(`${window.scrollY>=0.5*document.body.offsetHeight}`);
            if (window.scrollY>=0.5*document.body.offsetHeight && !nomore) {
                //! if (!asked.includes(start)) {
                    //window.removeEventListener('scroll', checkScroll);
                    //setTimeout(()=>{window.addEventListener('scroll', checkScroll);}, 2000)                    
                    //console.log(`@@@ I am ask trying with start: ${start}`);
                    //if (!asked.includes(start)) setAsked(asked.concat(start));
                //}
                setStart(start+10);
                //console.log(`@@@ I will update start from ${start} to ${start+10}`);
            }
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
                    })
                })
                setUsersList(tempL);
            })
            .catch(() => {
                ;
            })
        }
    }

    const addTags = () => {
        // gets post id from: newId
        // gets tagsList from: tagsToPost
        tagsToPost.forEach(obj => {
            let id = obj.tag.id;
            let object = {
                "mentioned": {
                    "id": id,
                }
            }
            PostPostTag(newId, object)
            .then(() => {
                ;
            })
            .catch(() => {
                ;
            })
        })
    }

    const filterPost = () => {
        let post_text = newText;
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
        setTagsToPost(final_post_object);
    }

    const clearAdd = () => {
        setNewText("");
        const input = document.getElementById('new-post-photo');
        input.value='';            
        createNotification('warning', 'Hello,', 'Publsh was cancelled');
    }

    const addPost = () => {
        //console.log("I am add post")
        const input = document.getElementById('new-post-photo');
        let img = null;
        if (input.files.length) {
            img = input.files[0];
        }
        if (!newText.length && !input.files.length) {
            createNotification('danger', 'Sorry,', 'You cannot create an empty post.')
        }
        else {
            createNotification('success', 'Please wait,', 'We are uploading your post.')
            setIsUploading(true);
            // if no text is given
            if (!newText.length) {
                // just create the post with empty text
                PostPostText(newText)
                .then(response => {
                    // then post the photo
                    let postId = response.data.id;
                    var bodyFormData = new FormData();
                    bodyFormData.append('image', img);
                    PostPostPhoto(postId, bodyFormData)
                    // if photo posted successfully
                    .then(() => {
                        filterPost();
                        setNewText("");
                        setNewId(postId);
                        setIsUploading(false);
                        setTagsToPost([]);
                        const input = document.getElementById('new-post-photo');
                        input.value=''
                        askPosts("restart");
                        createNotification('success', 'Hello,', 'Post published successfully.');

                    })
                    // else post has to be deleted (it only has an empty text)
                    .catch(err => {
                        //console.log(err);
                        setNewText("");
                        setIsUploading(false);
                        deletePost(postId)
                        .then(response => {
                            //console.log(response);
                        })
                        .catch(err => {
                            //console.log(err);
                        })
                        createNotification('danger', 'Sorry,', "We couldn't publish your post")
                    })
                })
                // could not create post => return err
                .catch(() => {
                    //console.log(err);
                    createNotification('danger', 'Sorry,', "We couldn't publish your post")
                    setIsUploading(false);
                    setTagsToPost([]);
                })
            }
            else {
                PostPostText(newText)
                .then(response => {
                    //console.log(response);
                    if(input.files.length) {
                        let postId = response.data.id;
                        var bodyFormData = new FormData();
                        bodyFormData.append('image', img);
                        PostPostPhoto(postId, bodyFormData)
                        // if photo posted successfully
                        .then(() => {
                            filterPost();
                            setNewText("");
                            setNewId(postId);
                            setIsUploading(false);
                            setTagsToPost([]);
                            askPosts("restart");
                            createNotification('success', 'Hello,', 'Post published successfully.');
                        })
                        // else post has to be deleted
                        .catch(() => {
                            setNewText("");
                            setIsUploading(false);
                            setTagsToPost([]);
                            deletePost(postId)
                            .then(() => {
                                ;
                            })
                            .catch(() => {
                                ;
                            })
                            createNotification('danger', 'Sorry,', "We couldn't publish your post")
                        })
                    }
                    else {
                        filterPost();
                        setNewText("");
                        setNewId(response.data.id);
                        setIsUploading(false);
                        setTagsToPost([]);
                        askPosts("restart");
                        createNotification('success', 'Hello,', 'Post published successfully.');
                    }
                })
                // could not create post => return err
                .catch(err => {
                    setIsUploading(false);
                    setTagsToPost([]);
                    createNotification('danger', 'Sorry,', "We couldn't publish your post")
                })
            }
        }
    }
    
    const askPosts = (how="") => {
        setIsLoading(true);
        if (how==="restart") {
            //console.log(`@@@ I asm ask posts restart`)
            setAsked([]);
            setPostsList([]);
            setNomore(false);
            if (start!==1) setStart(1);
            else setRestarted(!restarted);
            return
        }
        //console.log(`@@@ I asm ask posts with: start=${start} and asked=${asked}`)
        if (!asked.includes(start)) {
            if (props.whose) {
                getUsersPosts(props.whose, start, start+9)
                .then(response => {
                    setPostsList(postsList.concat(response.data));
                    setNomore(false);
                    setIsLoading(false);
                    setAsked(asked.concat(start));
                })
                .catch(() => {
                    setNomore(true);
                })
            }
            else {
                getPosts(start, start+9, props.case)
                .then(response => {
                    setPostsList(postsList.concat(response.data));
                    setNomore(false);
                    setIsLoading(false);
                    setAsked(asked.concat(start));
                })
                .catch(() => {
                    setNomore(true);
                })
            }
        }
    }
    
    useEffect(() => {
        setUser(props.user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user])

    useEffect(() => {
        window.addEventListener('scroll', checkScroll);
        return () => {
            window.removeEventListener('scroll', checkScroll);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    useEffect(() => {
        if (tagsToPost.length) addTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagsToPost])

    useEffect(() => {
        //console.log(`@@@ Start updated to ${start}`)
        askPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start])

    useEffect(() => {
        askPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restarted])

    useEffect(() => {
        askPosts("restart");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.updateMe])


    
    return(
        <div className={props.whose ? "user-posts-container padding-bottom" : "posts-container padding-bottom flex-item"}
             style={props.whose ? {paddingTop: '50px', marginTop: '5px'} : {}}>
            {isUploading &&
                <div style={{'marginBottom': '15px'}} className='center-content margin-top'>
                    <Spinner animation="border" role="status" variant='primary' />
                </div>
            }
            {user && !isUploading && (props.whose ? props.whose===user.id : true) &&
                <div className="new-post-container">
                    <h5><i>Hi {user.username}, what's on your mind?</i></h5>
                        <h6 className='margin-top-smaller'><i>Media</i></h6>
                        <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                        <input id="new-post-photo" type="file" accept="image/*, video/*"/>
                        <h6 className='margin-top-smaller'><i>Text</i></h6>
                        <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                        <MentionsInput name="newText" className="post-textarea-edit clean-style new-post" style={{width: '90%'}} value={newText} onChange={(event)=>setNewText(event.target.value)} onFocus={askTags}>
                            <Mention
                                trigger="@"
                                data={usersList}
                                className="mention-suggestions"
                            />
                        </MentionsInput>
                        <div className="flex-layout margin-top-smaller">
                            <Button variant='primary' className="margin" onClick={addPost}>Publish</Button>
                            <Button variant='outline-primary' className="margin" onClick={clearAdd}>Clear</Button>
                        </div>
                </div>
            }
            {postsList.map((value, index) => {
                return(
                    <OnePost key={index}
                            post={value}
                            user={user}
                            updateHome={props.updateHome}
                            updateParent={askPosts}
                            setShowingMedia={props.setShowingMedia}
                            setImage={props.setImage}
                            setVideo={props.setVideo}
                    />
                )
            })}
            {!postsList.length && nomore &&
                <div className="error-message margin-top center-text">Oops, no posts found..</div>
            }
            {!postsList.length && !nomore &&
                <div className='center-content margin-top'>
                    <Spinner animation="border" role="status" variant='primary' />
                </div>
            }
            {window.innerWidth>=500 &&
                <input type="image" 
                    onClick={ ()=>{      
                        window.scrollTo({
                            top:0,
                            left:0,
                            behavior:'smooth'
                        })}
                    }
                    className="up-button"
                    src={arrow_icon}
                    alt="top-page">
                </input>
            }
        </div>
    )
}

export default Posts;