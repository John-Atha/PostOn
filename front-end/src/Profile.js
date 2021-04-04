import React from 'react';
import './Profile.css';
import OutsideClickHandler from 'react-outside-click-handler';
import ProfileCard from  './ProfileCard';

import MyNavbar from './MyNavbar';
import UserPosts from './UserPosts';
import {getUser, updateUser, updateUserPhoto, getFollowersCount, getFollowsCount, getFollows, getFollowers, getFollowsPagi, getFollowersPagi, followUser, unfollowUser, isLogged} from './api';
import Searchbar from './Searchbar';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

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
                <div className="like-owner flex-item-small flex-layout"                        
                        onMouseEnter={this.cardShow}
                        onMouseLeave={this.cardHide}>
                    <div className="user-photo-container-small"
                                    onMouseEnter={this.cardShow}
                                    onMouseLeave={this.cardHide} >
                        <img className="user-photo" src={this.state.user.photo} alt="user profile" />
                    </div>
                    <div className="owner-name">
                            {this.state.user.username}
                    </div>
                    
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
                        <div className="follows-pop-up center-content">
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
            userId: parseInt(this.props.userId),
            me: null,
            logged: false,
            username: null,
            username_init: null,
            moto: null,
            moto_init: null,
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
            isFollowing: false,
            isFollowed: false,
            edit: false,
            updateFlag: 0,
            photoEdit: false,
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
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.editProf = this.editProf.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
    }

    createNotification = (type, title="aaa", message="aaa") => {
        console.log("creating notification");
        console.log(type);
        store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: true
            }
          });
    };
    saveChanges = () => {
        if (!this.state.username.length) {
            this.createNotification('danger', 'Sorry,', "You can't have an empty username");
        }
        else {
            
            updateUser(this.state.userId, this.state.username, this.state.moto||"")
            .then(response => {
                console.log(response);
                this.createNotification('success', 'Hello,', "Profile updated successfully");
                this.setState({
                    username_init: this.state.username,
                    moto_init: this.state.moto,
                    edit: false,
                    updateFlag: this.state.updateFlag+1,
                })
            })
            .catch(err => {
                console.log(err);
                this.createNotification('danger', 'Sorry,', "Username probably already exists");
                this.setState({
                    username: this.state.username_init,
                    moto: this.state.moto_init,
                })
            })
            const input = document.getElementById('new_profile_photo');
            if (input.value) {
                var bodyFormData = new FormData();
                bodyFormData.append('image', input.files[0]);
                updateUserPhoto(this.state.userId, bodyFormData)
                .then(response=> {
                    console.log(response);
                    this.setState({
                        photo: response.data.photo,
                        //newPhoto: "",
                        edit: false,
                        updateFlag: this.state.updateFlag+1,
                    })
                    input.value = "";
                    this.createNotification('success', 'Hello,', "Profile photo updated successfully");
                })
                .catch(err => {
                    console.log(err);
                    input.value = "";
                    this.createNotification('danger', 'Sorry,', "Could not update profile picture.");
                })
            }
        }
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });

    }
    discardChanges = () => {
        this.setState({
            username: this.state.username_init,
            moto: this.state.moto_init,
            edit: false,
        })
        const input = document.getElementById('new_profile_photo');
        input.value="";
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        this.createNotification('warning', 'Hello,', 'Changes cancelled');

    }
    handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        })
    }
    editProf = () => {
        this.setState({
            edit: true,
        })
    }
    follow = () => {
        console.log(`follower id: ${this.state.me}`)
        console.log(`followed id: ${this.state.userId}`)
        followUser(this.state.me, this.state.userId)
        .then(response => {
            console.log(response);
            this.updateMyFollows();
        })
        .catch(err => {
            console.log(err);
        })
    }
    unfollow = () => {
        let index = null;
        this.state.myFollowsList.forEach(el => {
            if (el===this.state.userId) {
                index = this.state.myFollowsList.indexOf(el);
            }
        })
        let followId = this.state.myFollowsObjIdList[index];
        unfollowUser(followId)
        .then(response => {
            console.log(response);
            this.updateMyFollows();
        })
        .catch(err => {
            console.log(err);
        })
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
                    isFollowed: tempFollowsList.includes(this.state.userId),
                })
            })
            .catch(err => {
                console.log(err);
                console.log("No more follows found for this user (as a follower).");
            });
            getFollowers(this.state.me)
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
                    isFollowing: tempFollowersList.includes(this.state.userId),
                })
                console.log("FollowersList:");
                console.log(this.state.myFollowersList);
                console.log(this.state.isFollowing);
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
                username_init: response.data.username,
                moto: response.data.moto,
                moto_init: response.data.moto,
                country: response.data.country.title,
                photo: response.data.photo,
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
                <Searchbar />
                <div className="profile-main center-content">
                        <h3 className="profile-username margin-top-smaller">
                            {this.state.username}
                        </h3>
                </div>
                <div className="flex-layout" style={{position: 'relative'}}>
                        <div className="user-photo-profile-container">
                            <img className="user-photo" src={this.state.photo} alt="user profile" />
                        </div>
                        <div className="margin-top-small margin-left center-content">
                            <button className="foll-button" style={{width: '80%'}} onClick={this.showFollowers}>
                                {this.state.followersNum} followers
                            </button>
                            <button className="foll-button margin-top-small" style={{width: '80%'}} onClick={this.showFollows}>
                                {this.state.followsNum} follows
                            </button>
                            <div>
                            {this.state.logged && !this.state.isFollowed && !this.state.isFollowing && this.state.me!==this.state.userId &&
                                <button className="foll-button margin-top-small" style={{width: '90%', backgroundColor: 'white'}} onClick={this.follow}>Follow</button>
                            }
                            {this.state.logged && !this.state.isFollowed && this.state.isFollowing && this.state.me!==this.state.userId &&
                                <button className="foll-button margin-top" style={{width: '90%', backgroundColor: 'white'}} onClick={this.follow}>Follow Back</button>
                            }
                            {this.state.logged && this.state.isFollowed && this.state.me!==this.state.userId &&
                                <button className="foll-button margin-top-small" style={{width: '90%', backgroundColor: 'white'}} onClick={this.unfollow}>Unfollow</button>
                            }
                            {this.state.logged && this.state.me===this.state.userId &&
                                <button className="foll-button margin-top-small" style={{width: '90%', backgroundColor: 'white'}} onClick={this.editProf}>Edit info</button>               
                            }
                        </div>
                </div>
                {!this.state.edit && this.state.moto &&
                    <div className="profile-info">
                        <div>
                            {this.state.moto}
                        </div>
                    </div>
                }
                {this.state.edit &&
                    <div className="profile-info">
                        <div>
                            <div>Username</div>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <input type="text" name="username" className="clean-style" style={{width: '50%'}} value={this.state.username} onChange={this.handleInput} />
                            <div >Bio</div>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <textarea name="moto" className="clean-style" style={{width: '90%'}} value={this.state.moto} onChange={this.handleInput} />
                            <div>Profile picture</div>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <input id="new_profile_photo" type="file" accept="image/*" />
                            <div className="flex-layout margin-top-smaller">
                                <button className="my-button save-moto-button" style={{margin: '1%'}} onClick={this.saveChanges}>Save</button>
                                <button className="my-button save-moto-button" style={{margin: '1%'}} onClick={this.discardChanges}>Cancel</button>
                            </div>
                        </div>
                    </div>
                }
                </div>
                <div className="adjusted-width">
                    <hr className="no-margin"></hr>
                    <h4 className="center-text">Posts</h4>
                    <hr className="no-margin"></hr>
                    <UserPosts whose={this.state.userId} me={this.state.me} updateHome={this.updateMyFollows} updateMe={this.state.updateFlag} />
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