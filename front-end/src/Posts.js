import React from "react";
import "./Posts.css";

import {isLogged, getPosts, myLikes, getUsersPosts} from './api';
import OnePost from './OnePost';

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
            likesEnd: 1,
            likesList: [],
            whose: this.props.whose,
        }
        this.likesIncr = 10;
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askPosts = this.askPosts.bind(this);
        this.askLikes = this.askLikes.bind(this);
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

    askLikes = () => {
        this.state.postsList.map((value) => {
            if (this.state.likesList.includes(value.id)) {
                this.likesIncr++;
            }
        })
        console.log(`I ask likes from ${this.state.likesEnd} to ${this.state.likesEnd+this.likesIncr+1}`);
        myLikes(this.state.likesEnd, this.state.likesEnd+this.likesIncr, this.state.userId)
        .then(response => {
            console.log(response);
            let tempLikesList = this.state.likesList;
            response.data.forEach(el => {
                if (!tempLikesList.includes(el.post.id)) {
                    tempLikesList.push(el.post.id);
                }
            })
            this.setState({
                likesList: tempLikesList,
                likesEnd: this.state.likesEnd+this.likesIncr,
            })
            console.log("likesList: ");
            console.log(tempLikesList);
            this.likesIncr = 0;
        })
        .catch(err => {
            console.log(err);
            console.log("No more likes found for this user.")
        })
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
            <div className="posts-container padding-bottom flex-item">

                {this.state.postsList.length && this.state.postsList.map((value, index) => {
                    let liked=null;
                    if (this.state.likesList.includes(value.id)) {
                        console.log("liked")
                        liked=true;
                    }
                    else {
                        liked=false;
                    }
                    return(
                        <OnePost key={index}
                                    id={value.id}
                                    owner={value.owner}
                                    text={value.text}
                                    media={value.media}
                                    date={value.date}
                                    userId={this.state.userId}
                                    logged={this.state.logged}
                                    liked={liked}
                                    updateHome={this.props.updateHome}
                        />
                    )
                    
                })}
                {this.state.postsList.length &&
                    <div className="pagi-buttons-container flex-layout center-content">
                        <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                        <button disabled={!this.state.postsList.length} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                    </div>
                }
                {!this.state.postsList.length &&
                    <div className="error-message margin-top center-text">Oops, no posts found..</div>
                }
            </div>
        )
    }
}

export default Posts;