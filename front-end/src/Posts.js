import React from "react";
import "./Posts.css";

import {isLogged, getPosts, getPostsLikesSample, getPostsCommentsSample} from './api';
import user_icon from './images/user-icon.png'; 
import like_icon from './images/like.png';
import comment_icon from './images/comment.png';

class OnePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            owner: this.props.owner,
            media: this.props.media,
            text: this.props.text,
            date: this.props.date,
            likesNum: 0,
            commentsNum: 0,
            likerSample: {
                username: "Loading..."
            },
            commenterSample: {
                username: "Loading..."
            },
            likes_error: null,
            comments_error: null,
        }
        this.likesSample = this.likesSample.bind(this);
        this.commentsSample = this.commentsSample.bind(this);
        this.statsSample = this.statsSample.bind(this);
    }

    commentsSample = () => {
        setTimeout(()=> {}, 2000);
        getPostsCommentsSample(this.state.id)
        .then(response => {
            console.log(response);
            this.setState({
                commentsNum: response.data.comments,
                commenterSample: response.data["one-comment"].owner,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                comments_error: "No comments found",
            })
        })

    }

    likesSample = () => {
        setTimeout(()=> {}, 2000);
        getPostsLikesSample(this.state.id)
        .then(response => {
            console.log(response);
            this.setState({
                likesNum: response.data.likes,
                likerSample: response.data["one-liker"],
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                likes_error: "No likes found",
            })
        })

    }

    statsSample = () => {
        this.likesSample();
        this.commentsSample();
    }

    componentDidMount() {
        this.statsSample();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id!==this.props.id) {
            console.log("NEW POST!!")
            this.setState({
                id: this.props.id,
                owner: this.props.owner,
                media: this.props.media,
                text: this.props.text,
                date: this.props.date,    
            })
            this.statsSample();
        }
    }

    render() {
        let datetime = this.state.date.replace('T', ' ').replace('Z', '').split(' ')
        let date = datetime[0]
        let time = datetime[1]

        return(
            <div className="post-container">
                    <div className="flex-layout">
                        <div className="user-photo-container">
                            <img className="user-photo" src={user_icon} alt="user profile picture" />
                        </div>
                        <div>
                            <div className="owner-name">{this.state.owner.username}</div>
                            <div className="post-date">{time}<br></br>{date}
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="post-text">{this.state.text}</div>
                <hr></hr>
                <div className="stats-sample flex-layout">
                    <div className="likes-sample flex-layout">
                        <img className="like-icon" src={like_icon} alt="like-icon"/>
                        {this.state.likesNum>1 &&
                            <div className="liker-sample">{this.state.likerSample.username} and {this.state.likesNum-1} more</div>
                        }
                        {this.state.likesNum===1 &&
                            <div className="liker-sample">{this.state.likerSample.username}</div>
                        }
                        {!this.state.likesNum &&
                            <div className="liker-sample">0</div>
                        }
                    </div>
                    <div className="comments-sample flex-layout">
                        <img className="like-icon" src={comment_icon} alt="comment-icon"/>
                        {this.state.commentsNum>1 &&
                            <div className="likes-sample-num">{this.state.commenterSample.username} and {this.state.commentsNum-1} more</div>
                        }
                        {this.state.commentsNum===1 &&
                            <div className="likes-sample-num">{this.state.commenterSample.username}</div>
                        }
                        {!this.state.commentsNum &&
                            <div className="likes-sample-num">0</div>
                        }
                    </div>  
                </div>
            </div>
        )
    }
}

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
        }
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askPosts = this.askPosts.bind(this);
    }

    moveOn = () => {
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        setTimeout(() => this.askPosts(), 1000);
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
    }

    askPosts = () => {
        setTimeout(()=> {}, 2000)
        console.log(`I am asking posts from ${this.state.start} to ${this.state.end}`)
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

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            });
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
            <div className="posts-container padding-bottom">
                {this.state.case==="all" &&
                    <h3 className="center-text">All Posts</h3>
                }
                {this.state.case==="following" &&
                    <h3 className="center-text">Following Posts</h3>
                }
                {this.state.postsList.length && this.state.postsList.map((value, index) => {
                    return(
                        <OnePost key={index} id={value.id} owner={value.owner} text={value.text} media={value.media} date={value.date}/>
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