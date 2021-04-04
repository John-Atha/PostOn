import React from 'react';
import './Explore.css'
import ProfileCard from './ProfileCard';
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
            showCard: false,
        }
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
    }

    cardShow = () => {
        this.setState({
            showCard: true,
        })
    }
    cardHide = () => {
        this.setState({
            showCard: false,
        })
    }
    follow = () => {
        console.log(`follower id: ${this.props.me}`)
        console.log(`followed id: ${this.state.user.id}`)
        followUser(this.props.me, this.state.user.id)
        .then(response => {
            console.log(response);
            this.props.updatePar();
        })
        .catch(err => {
            console.log(err);
            this.props.updatePar();
        })
    }
    unfollow = () => {
        unfollowUser(this.props.followId)
        .then(response => {
            console.log(response);
            this.props.updatePar();
        })
        .catch(err => {
            console.log(err);
            this.props.updatePar();
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
                            <img className="user-photo" src={this.state.user.photo} alt="user profile" />
                    </div>
                    <div className="owner-name"
                        onMouseEnter={this.cardShow}
                        onMouseLeave={this.cardHide}>
                        {this.state.user.username}
                        {this.state.showCard &&
                            <ProfileCard id={this.state.user.id}
                                    username={this.state.user.username}
                                    moto={this.state.user.moto}
                                    photo={this.state.user.photo}
                                    position={"right-more"} />
                        }
                    </div>
                </div>
                {this.state.logged && !this.props.followed && !this.props.following && this.props.me!==this.props.user.id &&
                    <div className="flex-item-smaller">
                        <button className="my-button un-follow-button pale-blue" onClick={this.follow}>Follow</button>
                    </div>
                }
                {this.state.logged && !this.props.followed && this.props.following && this.props.me!==this.props.user.id &&
                    <div className="flex-item-smaller">
                        <button className="my-button un-follow-button pale-blue" onClick={this.follow}>Follow Back</button>
                    </div>
                }
                {this.state.logged && this.props.followed && this.props.me!==this.props.user.id &&
                    <div className="flex-item-smaller">
                        <button className="my-button un-follow-button" onClick={this.unfollow}>UnFollow</button>
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
            followsObjIdList: [],
            followersList: [],
        }
        this.first = true;
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askUsers = this.askUsers.bind(this);
        this.askFollows = this.askFollows.bind(this);
        this.updateFollows = this.updateFollows.bind(this);
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
                let tempFollowsObjIdList = this.state.followsObjIdList;
                response.data.forEach(el=> {
                    if (!this.state.followsList.includes(el.followed.id)) {
                        tempFollowsList.push(el.followed.id);
                        tempFollowsObjIdList.push(el.id);
                    }
                })
                this.setState({
                    followsList: tempFollowsList,
                    followsObjIdList: tempFollowsObjIdList,
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

    updateFollows = () => {
        this.setState({
            followsList: [],
            followsObjIdList: [],
            followersList: [],
        })
        this.props.updateMyPar();
        setTimeout(()=>{this.askFollows()}, 0);
    }

    componentDidMount() {
        this.askUsers();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !==this.props.userId) {
            console.log(`Updated to user ${this.props.userId}`);
            this.askUsers();
        }
        if (prevProps.update1!==this.props.update1) {
            console.log("UPDATED");
            this.updateFollows();
        }
    }

    render() {
        return(
            <div className="explore-container center-content">
                <h5>Explore</h5>
                {
                    this.state.usersList.length!==0 && this.state.usersList.map((value, index) => {
                        //console.log(value);
                        if (value.id!==this.props.userId) {
                            if (this.state.followsList.includes(value.id)) {
                                return (
                                    <OneUser key={index}
                                             user={value}
                                             me={this.props.userId}
                                             logged={this.props.logged}
                                             followId={this.state.followsObjIdList[this.state.followsList.indexOf(value.id)]}
                                             followed={true}
                                             updatePar={this.updateFollows} />
                                )
                            }
                            else if(!this.state.followsList.includes(value.id) && this.state.followersList.includes(value.id)) {
                                return (
                                    <OneUser key={index}
                                            user={value}
                                            me={this.props.userId} 
                                            logged={this.props.logged} 
                                            followed={false} 
                                            following={true}
                                            updatePar={this.updateFollows} />
                                )    
                            }
                            else {
                                return (
                                    <OneUser key={index} 
                                            user={value} 
                                            me={this.props.userId} 
                                            logged={this.props.logged} 
                                            followed={false} 
                                            following={false}
                                            updatePar={this.updateFollows} />
                                )    
                            }
                        }
                        })
                }
                {this.state.usersList.length!==0 && 
                    <div className="pagi-buttons-container flex-layout center-content">
                        <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                        <button disabled={!this.state.usersList.length} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                    </div>            
                }
                {!this.state.usersList.length!==0 &&
                    <div className="error-message margin-top center-text">{this.state.error}</div>
                }
            </div>
        )
    }
}

export default Explore;