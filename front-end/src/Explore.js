import React from 'react';
import './Explore.css'

import user_icon from './images/user-icon.png'; 

import {getUsers} from './api';


class OneUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            logged: this.props.logged,
            me: this.props.id,
            error: null,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user!==this.props.user) {
            this.setState({
                user: this.props.user,
            })
        }
    }

    render() {
        return (
            <div className="one-user-line flex-layout">
                
                <div className="flex-layout flex-item-small">
                    <div className="user-photo-container-small">
                            <img className="user-photo" src={user_icon} alt="user profile" />
                    </div>
                    <div className="owner-name">{this.state.user.username}</div>
                </div>
                <div className="flex-item-smaller">
                    <button className="my-button un-follow-button">Follow</button>
                </div>


            </div>
        )
    }
}

class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.id,
            logged: this.props.logged,
            error: null,
            start:1,
            end:15,
            usersList: [],
        }
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askUsers = this.askUsers.bind(this);

    }

    moveOn = () => {
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        setTimeout(() => this.askUsers(), 1000);
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

    askUsers = () => {
        getUsers(this.state.start, this.state.end)
        .then(response => {
            console.log(response);
            this.setState({
                usersList: response.data,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "No more users found",
            })
        })        
    }

    componentDidMount() {
        this.askUsers();
    }

    render() {
        return(
            <div className="explore-container center-content">
                <h5>Explore</h5>
                {
                    this.state.usersList.length && this.state.usersList.map((value, index) => {
                        console.log(value);
                        return (
                            <OneUser key={index} user={value} me={this.state.userId} logged={this.logged} />
                        )
                        })
                }
                {this.state.usersList.length && 
                    <div className="pagi-buttons-container flex-layout center-content">
                        <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                        <button disabled={!this.state.usersList.length} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                    </div>            
                }
                {!this.state.usersList.length &&
                    <div className="error-message margin-top center-text">{this.state.error}</div>
                }
            </div>
        )
    }
}

export default Explore;