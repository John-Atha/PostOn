import React from "react";
import "./Posts.css";

import {isLogged, getUsersPosts} from './api';


import OnePost from './OnePost';

class UserPosts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: null,
            logged: false,
            error: null,
            postsList: [],
            start: 1,
            end: 10,
            whose: this.props.whose,
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
    }



    askPosts = () => {
        setTimeout(()=> {}, 1000)
        console.log(`I am asking posts from ${this.state.start} to ${this.state.end}`)
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
            <div className="posts-container padding-bottom flex-item">

                {this.state.postsList.length && this.state.postsList.map((value, index) => {
                    let liked=null;
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

export default UserPosts;