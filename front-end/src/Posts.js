import React from "react";
import "./Posts.css";
import {isLogged, getPosts, getUsersPosts, PostPostText, PostPostPhoto, deletePost} from './api';
import OnePost from './OnePost';
import add_icon from './images/add.png';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

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
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        })
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
                        this.setState({
                            newText: "",
                            add : false,
                        })
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
                            this.setState({
                                newText: "",
                                add : false,
                            })
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
                        this.setState({
                            newText: "",
                            add : false,
                        })
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
        setTimeout(()=>this.askLikes(), 750);
    }
    askPosts = () => {
        setTimeout(()=> {}, 1000)
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
            this.askLikes();
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
                            <textarea name="newText" className="clean-style backcolor2" style={{width: '90%'}} value={this.state.newText} onChange={this.handleInput} />
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
                        <button disabled={!this.state.postsList.length} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
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