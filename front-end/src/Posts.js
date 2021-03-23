import React from "react";
import "./Posts.css";

import {isLogged, getPosts} from './api';
import user_icon from './images/user-icon.png' 

class OnePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            owner: this.props.owner,
            media: this.props.media,
            text: this.props.text,
            date: this.props.date,
        }
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
        }
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.askPosts = this.askPosts.bind(this);
    }

    previousPage = () => {
        setTimeout(this.setState({
            start: this.state.start-10,
            end: this.state.end-10,
        }), 0)
        setTimeout(() => this.askPosts(), 200);
    }
    nextPage = () => {
        setTimeout(this.setState({
            start: this.state.start+10,
            end: this.state.end+10,
        }), 0)
        setTimeout(() => this.askPosts(), 200);
    }

    askPosts = () => {
        console.log(`I am asking posts from ${this.state.start} to ${this.state.end}`)
        getPosts(this.state.start, this.state.end)
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
                <h3 className="center-text">Posts {this.state.start} to {this.state.end}:</h3>
                {this.state.postsList.map((value, index) => {
                    return(
                        <OnePost key={index} id={value.id} owner={value.owner} text={value.text} media={value.media} date={value.date}/>
                    )
                })}
                <div className="pagi-buttons-container flex-layout center-content">
                    <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                    <button className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                </div>
            </div>
        )
    }
}

export default Posts;