import React from "react";
import "./Posts.css";

import {isLogged, getPosts} from './api';

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
        return(
            <div className="post-container">
                <div className="post-owner">Owner: {this.state.owner.id}, {this.state.owner.username}</div>
                <div className="post-text">Text: {this.state.text}</div>
                <div className="post-date">Date: {this.state.date.replace('T', ' ').replace('Z', ' ')}</div>
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
            end: 2,
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
            setTimeout(()=>this.askPosts(), 200);
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: err,
            })
        })
    }

    render() {
        return(
            <div className="posts-container">
                Posts {this.state.start} to {this.state.end}:
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