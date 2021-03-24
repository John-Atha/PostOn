import React from "react";
import "./Likes.css";

import {getPostLikes} from './api';


class OneLike extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.owner,
        }
    }

    render() {
        return(
            <div className="one-like flex-layout">
                <div className="like-owner flex-item-small">
                    {this.state.owner.username}
                </div>
                <div className="un-follow-button-container flex-item-small">
                    <button className="my-button un-follow-button">Follow</button>
                </div>
            </div>
        )
    }
}

class Likes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            postId: this.props.postId,
            error: null,
            start: 1,
            end: 5,
            likesList: [],
        }
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askLikes = this.askLikes.bind(this);
        this.disappear = this.disappear.bind(this);
    }
    
    disappear = (event) => {
        event.target.parentElement.style.display = "none";
    }

    moveOn = () => {
        setTimeout(() => this.askLikes(), 1000);
    }
    
    previousPage = () => {
        setTimeout(this.setState({
            start: this.state.start-5,
            end: this.state.end-5,
            likesList: [],
        }), 0)
        this.moveOn();
    }
    nextPage = () => {
        setTimeout(this.setState({
            start: this.state.start+5,
            end: this.state.end+5,
            likesList: [],
        }), 0)
        this.moveOn();
    }

    askLikes = () => {
        setTimeout(()=> {}, 2000);
        console.log(`I am asking likes from ${this.state.start} to ${this.state.end}.`);
        getPostLikes(this.state.start, this.state.end, this.state.postId)
        .then(response => {
            console.log(response);
            this.setState({
                likesList: response.data,
                error: null,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "No likes found."
            })
        })
    }

    componentDidMount() {
        this.askLikes();
    }

    render() {
        return (
            <div className="likes-pop-up center-content">
                <button className="close-button" onClick={this.disappear}>X</button>
                <h5>Likes</h5>
                {(this.state.error) && 
                    <div className="error-message">
                        No likes found...
                    </div>
                }
                {this.state.likesList.length>0 &&
                    this.state.likesList.map((value, index) => {
                        console.log(this.state.likesList)
                        return (
                            <OneLike key={index} owner={value.owner} />
                        )
                    })
                }
                {this.state.likesList.length>0 &&
                    <div className="pagi-buttons-container flex-layout center-content">
                        <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                        <button disabled={this.state.likesList.length<5} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                    </div>
                }

            </div>
        )
    }



}

export default Likes;