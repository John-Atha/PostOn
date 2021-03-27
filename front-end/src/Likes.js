import React from "react";
import "./Likes.css";

import {getLikes, getFollowers, getFollows, followUser, unfollowUser} from './api';

import OutsideClickHandler from 'react-outside-click-handler';

class OneLike extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.owner,
            logged: this.props.logged,
        }
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
    }

    follow = () => {
        console.log(`follower id: ${this.props.me}`)
        console.log(`followed id: ${this.state.owner.id}`)
        followUser(this.props.me, this.state.owner.id)
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
        if (prevProps.owner!==this.props.owner || prevProps.followed!==this.props.followed || prevProps.following!==this.props.following) {
            this.setState({
                owner: this.props.owner,
                logged: this.props.logged,
            })
        }
    }

    render() {
        return(
            <div className="one-like flex-layout">
                <div className="like-owner flex-item-small">
                    {this.state.owner.username}
                </div>
                <div className="un-follow-button-container flex-item-small">
                {this.state.logged && !this.props.followed && !this.props.following && this.props.me!==this.props.owner.id &&
                    <button className="my-button un-follow-button pale-blue" onClick={this.follow}>Follow</button>
                }
                {this.state.logged && !this.props.followed && this.props.following && this.props.me!==this.props.owner.id &&
                    <button className="my-button un-follow-button pale-blue" onClick={this.follow}>Follow Back</button>
                }
                {this.state.logged && this.props.followed && this.props.me!==this.props.owner.id &&
                    <button className="my-button un-follow-button" onClick={this.unfollow}>Unfollow</button>
                }
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
            id: this.props.id,
            error: null,
            start: 1,
            end: 5,
            likesList: [],
            on: this.props.on,
            followsList: [],
            followsObjIdList: [],
            followersList: [],
            showMe: this.props.showMe,
        }
        this.hide = this.hide.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askLikes = this.askLikes.bind(this);
        this.disappear = this.disappear.bind(this);
        this.askFollows = this.askFollows.bind(this);
        //this.updateFollows = this.updateFollows.bind(this);
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
        getLikes(this.state.start, this.state.end, this.state.id, this.state.on)
        .then(response => {
            console.log(response);
            this.setState({
                likesList: response.data,
                error: null,
            })
            this.askFollows();
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "No likes found."
            })
        })
    }
    hide = (event) => {
       // console.log(event);
       // document.querySelectorAll('.likes-pop-up').forEach(el => {
       //     el.style.display="none";
       // });
        event.preventDefault();
        this.setState({
            showMe: false,
        })
    }

    componentDidMount() {
        this.askLikes();
        localStorage.setItem('exploreReload1',false);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId!==this.props.userId || prevProps.followsUpd!==this.props.followsUpd || prevProps.showMe!==this.props.showMe) {
            console.log("I updated the follows list")
            this.askLikes();
            this.setState({
                showMe: this.props.showMe,
            })
        }
    }

    askFollows = () => {
        setTimeout(()=>{
            console.log(`I am asking follows for user ${this.props.userId}`)
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

    updateFollows = () => {
        this.setState({
            followsList: [],
            followsObjIdList: [],
            followersList: [],
        })
        setTimeout(()=>{this.askFollows()}, 0);
        this.props.updateHome();
    }

    render() {
        if (this.state.showMe) {
            return (
                <OutsideClickHandler onOutsideClick={this.hide}>
                    <div className="likes-pop-up center-content" >
                    <button className="close-button" onClick={this.disappear}>X</button>
                    <h5>Likes</h5>
                    {(this.state.error) && 
                        <div className="error-message">
                            No likes found...
                        </div>
                    }
                    {this.state.likesList.length>0 &&
                        this.state.likesList.map((value, index) => {
                            console.log(this.state.likesList);
                            console.log(this.state.followsList);
                            console.log(this.state.followersList);
                            if (this.state.followsList.includes(value.owner.id)) {
                                return (
                                    <OneLike key={index}
                                            owner={value.owner} 
                                            me={this.props.userId}
                                            logged={this.props.logged}
                                            followId={this.state.followsObjIdList[this.state.followsList.indexOf(value.owner.id)]}
                                            followed={true}
                                            updatePar={this.updateFollows} />
                                )
                            }
                            else if (!this.state.followsList.includes(value.owner.id) && this.state.followersList.includes(value.owner.id)) {
                                return (
                                    <OneLike key={index}
                                            owner={value.owner}
                                            me={this.props.userId} 
                                            logged={this.props.logged} 
                                            followed={false} 
                                            following={true}
                                            updatePar={this.updateFollows} />
                                )
                            }

                            else {
                                return (
                                    <OneLike key={index}
                                            owner={value.owner}
                                            me={this.props.userId} 
                                            logged={this.props.logged} 
                                            followed={false} 
                                            following={false}
                                            updatePar={this.updateFollows} />
                                )
                            }
                        })
                    }
                    {this.state.likesList.length>0 &&
                        <div className="pagi-buttons-container flex-layout center-content">
                            <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                            <button disabled={this.state.likesList.length<5} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                        </div>
                    }

                </div>
                </OutsideClickHandler>
            )
        }
        else {
            return (
                <div></div>
            )
        }

    }



}

export default Likes;