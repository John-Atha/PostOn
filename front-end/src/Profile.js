import React from 'react';
import './Profile.css';
import user_icon from './images/user-icon.png'; 
import OutsideClickHandler from 'react-outside-click-handler';
import ProfileCard from  './ProfileCard';

import MyNavbar from './MyNavbar';
import UserPosts from './UserPosts';
import {getUser, getFollowersCount, getFollowsCount, getFollows, getFollowers, getFollowsPagi, getFollowersPagi, followUser, unfollowUser, isLogged} from './api';


class OneUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            logged: this.props.logged,
            showCard: false,
        }
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
    }

    cardShow = () => {
        this.setState({
            mouseOutLink: false,
            mouseOutCard: false,
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
        return(
            <div className="one-like flex-layout">
                <div className="like-owner flex-item-small"                        
                        onMouseEnter={this.cardShow}
                        onMouseLeave={this.cardHide}>
                    {this.state.user.username}
                    {this.state.showCard &&
                        <ProfileCard id={this.state.user.id}
                                username={this.state.user.username}
                                moto={this.state.user.moto}
                                photo={this.state.user.photo}
                                position={"bottom"} />
                    }
                </div>
                <div className="un-follow-button-container flex-item-small">
                {this.state.logged && !this.props.followed && !this.props.following && this.props.me!==this.props.user.id &&
                    <button className="my-button un-follow-button pale-blue" onClick={this.follow}>Follow</button>
                }
                {this.state.logged && !this.props.followed && this.props.following && this.props.me!==this.props.user.id &&
                    <button className="my-button un-follow-button pale-blue" onClick={this.follow}>Follow Back</button>
                }
                {this.state.logged && this.props.followed && this.props.me!==this.props.user.id &&
                    <button className="my-button un-follow-button" onClick={this.unfollow}>Unfollow</button>
                }
                </div>
            </div>
        )
    }

}

class FollowBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            me: this.props.me,
            error: null,
            start: 1,
            end: 5,
            hisFollowsList: [],
            hisFollowersList: [],
            case: this.props.case,
            followsError: null,
            followersError: null,
        }
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askHisFollows = this.askHisFollows.bind(this);
        this.hide = this.hide.bind(this);
    }

    hide = (event) => {
        if (this.props.case==="follows") {
            this.props.hideFollows();
        }
        else{
            this.props.hideFollowers();
        }
        event.preventDefault();
    }
    moveOn = () => {
        setTimeout(() => this.askHisFollows(), 1000);
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
    askHisFollows = () => {
        if (this.state.case==="follows") {
            setTimeout(()=>{
                console.log(`I am asking follows for user ${this.props.userId}`)
                getFollowsPagi(this.props.userId, this.state.start, this.state.end)
                .then(response => {
                    console.log(response);
                    this.setState({
                        hisFollowsList: response.data,
                        followsError: null,
                    })
                    console.log("followsList: ");
                    console.log(response.data);
                })
                .catch(err => {
                    console.log(err);
                    console.log("No more follows found for this user (as a follower).");
                    this.setState({
                        followsError: "No more follows found from this user.",
                    })
                });
            }, 100)
        }
        else if (this.state.case==="followers") {
            setTimeout(()=>{
                console.log(`I am asking follows for user ${this.props.userId}`)
                getFollowersPagi(this.props.userId, this.state.start, this.state.end)
                .then(response => {
                    console.log(response);
                    this.setState({
                        hisFollowersList: response.data,
                    })
                    console.log("followersList: ");
                    console.log(response.data);
                })
                .catch(err => {
                    console.log(err);
                    console.log("No more follows found for this user (as followed).");
                    this.setState({
                        followersError: "No more followers found for this user.",
                    })

                });
            }, 100)
        }
    }
    componentDidMount() {
        this.askHisFollows();
        console.log(this.props.case)
    }

    render() {
        if (this.state.case==="follows" && this.state.hisFollowsList.length) {
                console.log("results:")
                console.log(this.state.hisFollowsList);
                return(
                    <OutsideClickHandler onOutsideClick={this.hide} >
                        <div className="follows-pop-up center-content">
                        {(this.state.followsError) && 
                            <div className="error-message">
                                {this.state.followsError}
                            </div>
                        }
                        {!this.state.followsError &&

                            this.state.hisFollowsList.map((value, index) => {
                                if(this.props.myFollowsList.includes(value.followed.id)) {
                                    console.log("my follows list:")
                                    console.log(this.props.myFollowsList)
                                    console.log(this.props.myFollowsObjIdList);
                                    console.log(value.followed.username);
                                    console.log(this.props.myFollowsObjIdList[this.props.myFollowsList.indexOf(value.followed.id)])
                                    return (
                                        <OneUser key={index}
                                                 user={value.followed}
                                                 me={this.state.me}
                                                 logged={this.state.logged}
                                                 followId={this.props.myFollowsObjIdList[this.props.myFollowsList.indexOf(value.followed.id)]}
                                                 followed={true}
                                                 updatePar={this.props.updateMyFollows} />
                                    )
                                }
                                else if(!this.state.hisFollowsList.includes(value.followed.id) &&
                                         this.props.myFollowersList.includes(value.followed.id)) {
                                            return(
                                                <OneUser key={index}
                                                         user={value.followed}
                                                         me={this.state.me}
                                                         logged={this.state.logged}
                                                         followed={false}
                                                         following={true}
                                                         updatePar={this.props.updateMyFollows} />
                                           )
                                }
                                else {
                                    return(
                                        <OneUser key={index}
                                                 user={value.followed}
                                                 me={this.state.me}
                                                 logged={this.state.logged}
                                                 followed={false}
                                                 following={false}
                                                 updatePar={this.props.updateMyFollows} />
                                    )
                                }
                            })}

                            {this.state.hisFollowsList.length>0 &&
                                <div className="pagi-buttons-container flex-layout center-content">
                                    <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                                    <button disabled={this.state.followsError} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                                </div>
                            }            

                        </div>
                    </OutsideClickHandler>
                )
        }
        else if (this.state.case==="followers" && this.state.hisFollowersList.length) {
                console.log("results:")
                console.log(this.state.hisFollowersList);
                return(
                    <OutsideClickHandler onOutsideClick={this.hide}>
                        <div className="follows-pop-up">
                            {(this.state.followsError) && 
                                <div className="error-message">
                                    {this.state.followsError}
                                </div>
                            }
                            {!this.state.followsError &&

                            this.state.hisFollowersList.map((value, index) => {
                                console.log(value);
                                if(this.props.myFollowsList.includes(value.following.id)) {
                                    console.log("my follows list:")
                                    console.log(this.props.myFollowsList)
                                    console.log(this.props.myFollowsObjIdList);
                                    console.log(value.following.username);
                                    console.log(this.props.myFollowsObjIdList[this.props.myFollowsList.indexOf(value.following.id)])

                                    return (
                                        <OneUser key={index}
                                                 user={value.following}
                                                 me={this.state.me}
                                                 logged={this.state.logged}
                                                 followId={this.props.myFollowsObjIdList[this.props.myFollowsList.indexOf(value.following.id)]}
                                                 followed={true}
                                                 updatePar={this.props.updateMyFollows} />
                                    )
    
                                }
                                else if(!this.props.myFollowsList.includes(value.following.id) &&
                                         this.props.myFollowersList.includes(value.following.id)) {
                                            return(
                                                <OneUser key={index}
                                                         user={value.following}
                                                         me={this.state.me}
                                                         logged={this.state.logged}
                                                         followed={false}
                                                         following={true}
                                                         updatePar={this.props.updateMyFollows} />
                                            )
                                }
                                else {
                                    return (
                                        <OneUser key={index}
                                                 user={value.following}
                                                 me={this.state.me}
                                                 logged={this.state.logged}
                                                 followed={false}
                                                 following={false}
                                                 updatePar={this.props.updateMyFollows} />
                                    )
                                }
                            })}
                            {this.state.hisFollowersList.length>0 &&
                                <div className="pagi-buttons-container flex-layout center-content">
                                    <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                                    <button disabled={this.state.followersError} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                                </div>
                            }            

                        </div>
                    </OutsideClickHandler>
                )
        }
        else {
            return(
                <div></div>
            )
        }
    }
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            me: null,
            logged: false,
            username: null,
            moto: null,
            country: null,
            photo: null,
            followsNum: 0,
            followersNum: 0,
            postsList: [],
            followersShow: false,
            followsShow: false,
            myFollowsList: [],
            myFollowsObjIdList: [],
            myFollowersList: [],
        }
        this.countFollows = this.countFollows.bind(this);
        this.countFollowers = this.countFollowers.bind(this);
        this.showFollowers = this.showFollowers.bind(this);
        this.showFollows = this.showFollows.bind(this);
        this.askMyFollows = this.askMyFollows.bind(this);
        this.updateMyFollows = this.updateMyFollows.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.checkLogged = this.checkLogged.bind(this);
        this.hideFollows = this.hideFollows.bind(this);
        this.hideFollowers = this.hideFollowers.bind(this);
    }
    countFollowers = () => {
        getFollowersCount(this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                followersNum: response.data.followers,
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    countFollows = () => {
        getFollowsCount(this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                followsNum: response.data.follows,
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    askMyFollows = () => {
        setTimeout(()=>{
            console.log("I am askMyFollows")
            console.log(`I am asking follows for user ${this.state.userId}`)
            getFollows(this.state.me)
            .then(response => {
                console.log(response);
                let tempFollowsList = this.state.myFollowsList;
                let tempFollowsObjIdList = this.state.myFollowsObjIdList;
                response.data.forEach(el=> {
                    if (!this.state.myFollowsList.includes(el.followed.id)) {
                        tempFollowsList.push(el.followed.id);
                        tempFollowsObjIdList.push(el.id);
                    }
                })
                this.setState({
                    myFollowsList: tempFollowsList,
                    myFollowsObjIdList: tempFollowsObjIdList,
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
                let tempFollowersList = this.state.myFollowersList;
                response.data.forEach(el=> {
                    if (!this.state.myFollowersList.includes(el.following.id)) {
                        tempFollowersList.push(el.following.id);
                    }
                })
                this.setState({
                    myFollowersList: tempFollowersList,
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
    updateMyFollows = () => {
        this.setState({
            myFollowsList: [],
            myFollowsObjIdList: [],
            myFollowersList: [],
        })
        setTimeout(()=>{this.askMyFollows(); this.countFollows(); this.countFollowers();}, 0);
    }
    getUserInfo = () => {
        getUser(this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                username: response.data.username,
                moto: response.data.moto,
                country: response.data.country.title,
                //photo....
            })
            setTimeout(()=>{
                this.countFollowers();
                this.countFollows();
            }, 1000);
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "Sorry, we could not find user's profile."
            })
        })
    }
    checkLogged = () => {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                me: response.data.id,
            })
            console.log(`I am user ${response.data.id}`)
            this.askMyFollows();
        })
        .catch(err => {
            console.log(err)
            this.setState({
                error: "Not logged in"
            })
        })
    }
    componentDidMount() {
        this.checkLogged();
        this.getUserInfo();
    }
    showFollowers = () => {
        console.log("chose to see followers")
        this.setState({
            followersShow: true,
        })
    }
    showFollows = () => {
        console.log("chose to see follows")
        this.setState({
            followsShow: true,
        })
    }
    hideFollowers = () => {
        this.setState({
            followersShow: false,
        })
    }
    hideFollows = () => {
        this.setState({
            followsShow: false,
        })
    }
    render() {
        return(
            <div className="all-page">
                <MyNavbar />
                <div className="profile-main center-content">
                        <h3 className="profile-username margin-top-smaller">
                            {this.state.username}
                        </h3>
                </div>
                <div className="profile-main center-content">
                    <div className="user-photo-container2">
                        <img className="user-photo" src={user_icon} alt="user profile" />
                    </div>
                    <div className="margin-left profile-info">
                        <div className="center-content">
                            {this.state.moto}
                        </div>
                        <div className="center-content">
                            country: {this.state.country}
                        </div>
                            <div className="center-content flex-layout">
                                <button className="foll-button" onClick={this.showFollowers}>
                                    Followers: {this.state.followersNum}
                                </button>
                                <button className="foll-button" onClick={this.showFollows}>
                                    Follows: {this.state.followsNum}
                                </button>
                            </div>
                    </div>
                </div>
                <div className="adjusted-width">
                    <h4 className="center-text">{this.state.username}'s posts</h4>
                    <UserPosts whose={this.state.userId}
                           updateHome={this.updateMyFollows} />
                </div>
                {this.state.followsShow &&
                    <FollowBox  userId={this.state.userId}
                                me={this.state.me}
                                logged={this.state.logged}
                                case="follows"
                                myFollowsList={this.state.myFollowsList}
                                myFollowersList={this.state.myFollowersList}
                                myFollowsObjIdList={this.state.myFollowsObjIdList}
                                hideFollows={this.hideFollows}
                                hideFollowers={this.hideFollowers}
                                updateMyFollows={this.updateMyFollows} />
                }
                {this.state.followersShow &&
                    <FollowBox  userId={this.state.userId}
                                me={this.state.me}
                                logged={this.state.logged}
                                case="followers"
                                myFollowsList={this.state.myFollowsList}
                                myFollowersList={this.state.myFollowersList}
                                myFollowsObjIdList={this.state.myFollowsObjIdList}
                                hideFollows={this.hideFollows}
                                hideFollowers={this.hideFollowers}
                                updateMyFollows={this.updateMyFollows} />
                }
            </div>
            
        )
    }
}

export default Profile;