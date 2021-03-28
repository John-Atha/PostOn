import React from 'react';

import {isLogged, getActivity} from './api';
import './Activity.css';
import MyNavbar from './MyNavbar';


class CommentAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="one-activity-container">
                I am a comment.
            </div>
        )
    }
}

class PostLikeAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="one-activity-container">
                I am a like on a post.
            </div>
        )
    }
}

class CommentLikeAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="one-activity-container">
                I am a like on a comment.
            </div>
        )
    }
}

class PostAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="one-activity-container">
                I am a post.
            </div>
        )
    }
}

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: null,
            actList: [],
            start: 1,
            end: 10,
            error: null,
        }
        this.askActivity = this.askActivity.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
    }

    moveOn = () => {
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        setTimeout(() => this.askActivity(), 500);
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

    askActivity = () => {
        getActivity(this.state.userId, this.state.start, this.state.end)
        .then(response=> {
            console.log(response);
            this.setState({
                actList: response.data,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "No more activity found",
            })
        })
    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            })
            setTimeout(()=>{this.askActivity();}, 2000);
        })
        .catch(err => {
            console.log(err)
            this.setState({
                error: "Not logged in"
            })
        })
    }

    render() {
        return (
        <div className="all-page">
            <MyNavbar />
            <div className="main-activity-container flex-layout">
                {this.state.actList.map((value, index) => {
                    if (value.post && value.text) {
                        return(
                            <CommentAction key={index} action={value} />
                        )
                    }

                    else if (value.comment) {
                        return(
                            <CommentLikeAction key={index} action={value} />
                        )
                    }

                    else {
                        return(
                            <PostLikeAction key={index} action={value} />
                        )
                    }

                })}
            </div>
            {this.state.actList.length &&
                <div className="pagi-buttons-container flex-layout center-content">
                    <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                    <button disabled={!this.state.actList.length} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                </div>
            }
            {!this.state.actList.length &&
                <div className="error-message margin-top center-text">Oops, no posts found..</div>
            }

        </div>


        )
    }


}

export default Activity;