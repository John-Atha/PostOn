import React from "react";
import "./Posts.css";
import {getUsers, isLogged, getPosts, getUsersPosts, PostPostText, PostPostPhoto, deletePost, PostPostTag} from './api';
import OnePost from './OnePost';
import add_icon from './images/add.png';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import { MentionsInput, Mention } from 'react-mentions'

class Posts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: null,
            logged: false,
            error: null,
            followingPosts: false,
            postsList: [],
            start: 1,
            end: 10,
            case: this.props.case,
            whose: this.props.whose,
            add: false,
            newText: "",
            usersList: [],
            firstFocus: true,
            tagsToPost: [],
            newId: null,
        }
        this.likesIncr = 10;
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askPosts = this.askPosts.bind(this);
        this.addPost = this.addPost.bind(this);
        this.preAddPost = this.preAddPost.bind(this);
        this.cancelAdd = this.cancelAdd.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.askTags = this.askTags.bind(this);
        this.filterPost = this.filterPost.bind(this);
        this.addTags = this.addTags.bind(this);
    }
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

    addTags = (text) => {
        // gets post id from: this.state.newId
        // gets tagsList from: this.state.tagsToPost
        this.filterPost(text);
        setTimeout(()=> {
            this.state.tagsToPost.forEach(obj => {
                let id = obj.tag.id;
                let object = {
                    "mentioned": {
                        "id": id,
                    }
                }
                PostPostTag(this.state.newId, object)
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                })
            })
        }, 200)
    }


    filterPost = (text) => {
        console.log("users i see")
        console.log(this.state.usersList)
        console.log("i am filter post");
        let post_text = text;
        console.log("initial text")
        let final_post_object = [];
        let s3 = [];
        post_text = post_text.replaceAll(")@", ") @");
        console.log(post_text);
        //let s2 = post_text.trim().split(/\s+/);
        let s2 = post_text.split(' ');
        for (let i=0; i<s2.length; i++) {
            s2[i]+=' ';
        }
        console.log("after fixing spaces")
        console.log(s2)
        for (let i=0; i<s2.length; i++) {
            if (s2[i]!==[' ']) {
                console.log("sublist")
                console.log(s2[i])
                let subList = s2[i].split('\n');
                console.log(subList)
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
        console.log("BROKEN LIST")
        //console.log(s2);
        s3 = s3.flat();
        console.log(s3);
        let index=0;
        s3.forEach(el => {
            console.log(el)
            if (el.startsWith('@')) {    
                let matched = false;
                this.state.usersList.forEach(suggest => {
                    let sugg=suggest.display;
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
                        console.log(`username: ${suggest.display}`)
                        console.log(`id: ${suggest.id}`)
                        console.log(`dump: ${dump}`)
                        final_post_object.push({
                            "tag": {
                                "username": suggest.display,
                                "id": suggest.id,
                            },
                            "dump": dump,
                        })
                        index++;
                    }
                })
            }
        })
        console.log("Tags to post:")
        console.log(final_post_object)
        this.setState({
            tagsToPost: final_post_object,
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
    handleInput = (event) => {
        const value = event.target.value;
        this.setState({
            newText: value,
        })
        console.log(`new text: ${this.state.newText}`);
    }
    cancelAdd = () => {
        this.setState({
            newText: "",
            add: false,
        })
        this.createNotification('warning', 'Hello,', 'Publsh was cancelled');
    }
    preAddPost = () => {
        if(!this.state.logged) {
            this.createNotification('danger', 'Sorry,', 'You have to create an account to upload a new post');
        }
        else {
            this.setState({
                add : true,
            })    
        }
    }
    addPost = () => {
        console.log("I am add post")
        const input = document.getElementById('new-post-photo');
        let img = null;
        if (input.files.length) {
            img = input.files[0];
            console.log(img);
        }
        if (!this.state.newText.length && !input.files.length) {
            this.createNotification('danger', 'Sorry,', 'You cannot create an empty post.')
        }
        else {
            // if no text is given
            if (!this.state.newText.length) {
                // just create the post with empty text
                PostPostText(this.state.newText)
                .then(response => {
                    console.log(response);
                    // then post the photo (has to be there, else the first "if" would have stopped the process)
                    let postId = response.data.id;
                    var bodyFormData = new FormData();
                    bodyFormData.append('image', img);
                    PostPostPhoto(postId, bodyFormData)
                    // if photo posted successfully
                    .then(response => {
                        console.log(response);
                        let prevText = this.state.newText;
                        this.setState({
                            newText: "",
                            add : false,
                            newId: postId,
                        })
                        setTimeout(()=>{this.addTags(prevText);}, 1000)
                        this.askPosts();
                        this.createNotification('success', 'Hello,', 'Post published successfully.');

                    })
                    // else post has to be deleted (it only has an empty text)
                    .catch(err => {
                        console.log(err);
                        this.setState({
                            newText: "",
                        })
                        deletePost(postId)
                        .then(response => {
                            console.log(response);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                        this.createNotification('danger', 'Sorry,', "We couldn't publish your post")
                    })
                })
                // could not create post => return err
                .catch(err => {
                    console.log(err);
                    this.createNotification('danger', 'Sorry,', "We couldn't publish your post")
                })
            }
            else {
                PostPostText(this.state.newText)
                .then(response => {
                    console.log(response);
                    if(input.files.length) {
                        let postId = response.data.id;
                        var bodyFormData = new FormData();
                        bodyFormData.append('image', img);
                        PostPostPhoto(postId, bodyFormData)
                        // if photo posted successfully
                        .then(response => {
                            console.log(response);
                            let prevText = this.state.newText;
                            this.setState({
                                newText: "",
                                add : false,
                                newId: postId,
                            })
                            setTimeout(()=>{this.addTags(prevText);}, 1000)
                            this.askPosts();
                            this.createNotification('success', 'Hello,', 'Post published successfully.');
                        })
                        // else post has to be deleted
                        .catch(err => {
                            console.log(err);
                            this.setState({
                                newText: "",
                            })
                            deletePost(postId)
                            .then(response => {
                                console.log(response);
                            })
                            .catch(err => {
                                console.log(err);
                            })
                            this.createNotification('danger', 'Sorry,', "We couldn't publish your post")
                        })
                    }
                    else {
                        let prevText = this.state.newText;
                        this.setState({
                            newText: "",
                            add : false,
                            newId: response.data.id,
                        })
                        setTimeout(()=>{this.addTags(prevText);}, 1000)
                        this.askPosts();
                        this.createNotification('success', 'Hello,', 'Post published successfully.');
                    }
                })
                // could not create post => return err
                .catch(err => {
                    console.log(err);
                    this.createNotification('danger', 'Sorry,', "We couldn't publish your post")
                })
            }
        }
    }
    moveOn = () => {
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        setTimeout(() => this.askPosts(), 500);
    }
    previousPage = () => {
        setTimeout(this.setState({
            start: this.state.start-10,
            end: this.state.end-10,
        }), 0)
        this.moveOn();
    }
    nextPage = () => {
        setTimeout(this.setState({
            start: this.state.start+10,
            end: this.state.end+10,
        }), 0)
        this.moveOn();
        //setTimeout(()=>this.askLikes(), 750);
    }
    askPosts = () => {
        this.setState({
            postsList: [],
        })
        setTimeout(()=> {}, 3000)
        console.log(`I am asking posts from ${this.state.start} to ${this.state.end}`)
        if (this.state.whose) {
            getUsersPosts(this.state.whose, this.state.start, this.state.end)
            .then(response => {
                console.log(response);
                this.setState({
                    postsList: response.data,
                })
                console.log(this.state.postsList)
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    postsList: [],
                })
            })
        }
        else {
            getPosts(this.state.start, this.state.end, this.state.case)
            .then(response => {
                console.log(response);
                this.setState({
                    postsList: response.data,
                })
                console.log(this.state.postsList)
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    postsList: [],
                })
            })
        }
    }
    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            });
            //this.askLikes();
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: err,
            })
        })
        setTimeout(()=>this.askPosts(), 200);
    }
    render() {
        return(
            <div className="posts-container padding-bottom flex-item" style={{paddingTop: '50px'}}>
                {this.state.add && 
                    <div className="new-post-container">
                            <div>Photo</div>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <input id="new-post-photo" type="file" accept="image/*"/>
                            <div >Text</div>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <MentionsInput name="newText" className="post-textarea-edit clean-style new-post" style={{width: '90%'}} value={this.state.newText} onChange={this.handleInput} onFocus={this.askTags}>
                                <Mention
                                    trigger="@"
                                    data={this.state.usersList}
                                    className="mention-suggestions"
                                />
                            </MentionsInput>
                            <div className="flex-layout margin-top-smaller">
                                <button className="my-button save-moto-button" style={{margin: '1%'}} onClick={this.addPost}>Publish</button>
                                <button className="my-button save-moto-button" style={{margin: '1%'}} onClick={this.cancelAdd}>Cancel</button>
                            </div>
                    </div>
                }
                {this.state.postsList.map((value, index) => {
                    return(
                        <OnePost key={index}
                                    id={value.id}
                                    owner={value.owner}
                                    text={value.text}
                                    media={value.media}
                                    date={value.date}
                                    userId={this.state.userId}
                                    logged={this.state.logged}
                                    updateHome={this.props.updateHome}
                                    updateParent={this.askPosts}
                        />
                    )
                })}
                {this.state.postsList.length!==0 &&
                    <div className="pagi-buttons-container flex-layout center-content">
                        <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                        <button disabled={this.state.postsList.length<10} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                    </div>
                }
                {!this.state.postsList.length &&
                    <div className="error-message margin-top center-text">Oops, no posts found..</div>
                }
                <button className="add-post-button" onClick={this.preAddPost} >
                    <img className="small-icon" src={add_icon} alt="add" />
                    New post
                </button>
            </div>
        )
    }
}

export default Posts;