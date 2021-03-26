import React from 'react';
import './Explore.css'

import user_icon from './images/user-icon.png'; 

import {getUsers, getFollows, getFollowers, followUser, unfollowUser} from './api';


class OneUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            logged: this.props.logged,
            me: this.props.me,
            error: null,
        }
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
    }

    follow = () => {
        console.log(`follower id: ${this.props.me}`)
        console.log(`followed id: ${this.state.user.id}`)
        followUser(this.props.me, this.state.user.id)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
    }

    unfollow = () => {
        unfollowUser(3)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
    }



    componentDidUpdate(prevProps) {
        if (prevProps.user!==this.props.user || prevProps.followed!==this.props.followed || prevProps.following!==this.props.following) {
            this.setState({
                user: this.props.user,
                logged: this.props.logged,
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
                {this.state.logged && !this.props.followed && !this.props.following &&
                    <div className="flex-item-smaller">
                        <button className="my-button un-follow-button" onClick={this.follow}>Follow</button>
                    </div>
                }
                {this.state.logged && !this.props.followed && this.props.following &&
                    <div className="flex-item-smaller">
                        <button className="my-button un-follow-button" onClick={this.follow}>Follow Back</button>
                    </div>
                }
                {this.state.logged && this.props.followed && 
                    <div className="flex-item-smaller">
                        <button className="my-button un-follow-button">UnFollow</button>
                    </div>
                }


            </div>
        )
    }
}

class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            error: null,
            start:1,
            end:15,
            usersList: [],
            followsList: [],
            followersList: [],
        }
        this.first = true;
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askUsers = this.askUsers.bind(this);
        this.askFollows = this.askFollows.bind(this);
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

    askFollows = () => {
        setTimeout(()=>{
            getFollows(this.props.userId)
            .then(response => {
                console.log(response);
                let tempFollowsList = this.state.followsList;
                response.data.forEach(el=> {
                    if (!this.state.followsList.includes(el.followed.id)) {
                        tempFollowsList.push(el.followed.id);
                    }
                })
                this.setState({
                    followsList: tempFollowsList,
                })
                console.log("followsList: ");
                console.log(tempFollowsList);
            })
            .catch(err => {
                console.log(err);
                console.log("No more follows found for this user (as a follower).");
            });
            getFollowers(this.props.userId)
            .then(response => {
                console.log(response);
                let tempFollowersList = this.state.followersList;
                response.data.forEach(el=> {
                    if (!this.state.followersList.includes(el.following.id)) {
                        tempFollowersList.push(el.following.id);
                    }
                })
                this.setState({
                    followersList: tempFollowersList,
                })
                console.log("followersList: ");
                console.log(tempFollowersList);
            })
            .catch(err => {
                console.log(err);
                console.log("No more follows found for this user (as a follower).");
            });
        }, 100)

    }

    askUsers = () => {
        getUsers(this.state.start, this.state.end)
        .then(response => {
            console.log(response);
            this.setState({
                usersList: response.data,
            })
            if(this.first) {
                this.askFollows();
                this.first = false;
            }
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

    componentDidUpdate(prevProps) {
        if (prevProps.userId !==this.props.userId) {
            console.log(`Updated to user ${this.props.userId}`);
            this.askUsers();
        }
    }

    render() {
        return(
            <div className="explore-container center-content">
                <h5>Explore</h5>
                {
                    this.state.usersList.length && this.state.usersList.map((value, index) => {
                        //console.log(value);
                        if (this.state.followsList.includes(value.id)) {
                                return (
                                    <OneUser key={index} user={value} me={this.props.userId} logged={this.props.logged} followed={true} />
                                )    
                        }
                        else if(!this.state.followsList.includes(value.id) && this.state.followersList.includes(value.id)) {
                            return (
                                <OneUser key={index} user={value} me={this.props.userId} logged={this.props.logged} followed={false} following={true} />
                            )    
                        }
                        else {
                            return (
                                <OneUser key={index} user={value} me={this.props.userId} logged={this.props.logged} followed={false} following={false}/>
                            )    
                        }
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