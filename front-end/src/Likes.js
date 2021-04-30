import React from "react";
import "./Likes.css";
import ProfileCard from  './ProfileCard';
import verified from './images/verified.png';
import {getLikes, getFollowers, getFollows, followUser, unfollowUser} from './api';
import OutsideClickHandler from 'react-outside-click-handler';

class OneLike extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.owner,
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
                <div className="like-owner flex-item-small flex-layout center-content"
                        onMouseEnter={this.cardShow}
                        onMouseLeave={this.cardHide}>

                    <div className="user-photo-container-small"
                                    onMouseEnter={this.cardShow}
                                    onMouseLeave={this.cardHide} >
                        <img className="user-photo" src={this.state.owner.photo} alt="user profile" />
                    </div>
                    <div className="owner-name">
                            {this.state.owner.username}
                            {this.state.owner.verified===true &&
                                <img className="verified-icon" src={verified} alt="verified" />
                            }
                    </div>

                    {this.state.showCard &&
                        <ProfileCard id={this.state.owner.id}
                                username={this.state.owner.username}
                                moto={this.state.owner.moto}
                                photo={this.state.owner.photo}
                                verified={this.state.owner.verified}
                                position={"bottom"} />
                    }
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
            kind: this.props.kinds[0],
            kinds: this.props.kinds,
        }
        this.hide = this.hide.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askLikes = this.askLikes.bind(this);
        this.disappear = this.disappear.bind(this);
        this.askFollows = this.askFollows.bind(this);
        this.updateFollows = this.updateFollows.bind(this);
        this.changeKind = this.changeKind.bind(this);
    }
    changeKind = (event) => {
        this.setState({
            kind: event.target.innerHTML,
            start: 1,
            end: 5,
            likesList: [],
            error: null,
        })
        setTimeout(()=> {console.log(this.state.kind)}, 0);
        Array.from(document.getElementsByClassName('likes-kinds-buttons')).forEach(el => {
            el.style.color = localStorage.getItem('theme')==='light' ? 'black' : 'white';
            el.style.borderBottomColor = localStorage.getItem('theme')==='light' ? 'black' : 'white';
        })
        event.target.style.color='green';
        event.target.style.borderBottomColor='green';
        this.askLikes();
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
        setTimeout(()=> {
        console.log(`I am asking likes from ${this.state.start} to ${this.state.end}.`);
        getLikes(this.state.start, this.state.end, this.state.id, this.state.on, this.state.kind)
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
                error: `No ${this.state.kind} reactions found.`
            })
        })}, 200);
    }
    hide = (event) => {
        event.preventDefault();
        this.setState({
            showMe: false,
        })
    }
    componentDidMount() {
        this.askLikes();
        Array.from(document.getElementsByClassName('likes-kinds-buttons')).forEach(el => {
            if (el.innerHTML===this.state.kind) {
                el.style.color = 'green';
                el.style.borderBottomColor = 'green';    
            }
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.userId!==this.props.userId || prevProps.followsUpd!==this.props.followsUpd) {
            console.log("I updated the follows list")
            this.askLikes();
            this.setState({
                showMe: this.props.showMe,
            })
        }
        if (prevProps.kinds!==this.props.kinds) {
            this.setState({
                kinds: this.props.kinds,
            })
        }
    }
    askFollows = () => {
        setTimeout(()=>{
            console.log(`I am asking follows for user ${this.props.userId}`)
            getFollows(this.props.userId)
            .then(response => {
                console.log(response);
                let tempFollowsList = [];
                let tempFollowsObjIdList = [];
                response.data.forEach(el=> {
                        tempFollowsList.push(el.followed.id);
                        tempFollowsObjIdList.push(el.id);
                })
                this.setState({
                    followsList: tempFollowsList,
                    followsObjIdList: tempFollowsObjIdList,
                })
                console.log("followsList: ");
                console.log(tempFollowsList);
                getFollowers(this.props.userId)
                .then(response => {
                    console.log(response);
                    let tempFollowersList = [];
                    response.data.forEach(el=> {
                            tempFollowersList.push(el.following.id);
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
            })
            .catch(err => {
                console.log(err);
                console.log("No more follows found for this user (as a follower).");
            });
        }, 1000)
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
            let classN = "likes-pop-up center-content";
            if (this.state.on==="comment") {
                classN = "likes-comments-pop-up center-content";
            }
            return (
                <OutsideClickHandler onOutsideClick={this.hide}>
                    <div className={classN} >
                        <button className="close-button" onClick={this.disappear}>X</button>
                        {this.state.on==='comment' &&
                            <h5>Likes</h5>
                        }
                        {this.state.on==='post' &&
                            <div className="flex-layout center-content">
                                {this.state.kinds.map((value, index) => {
                                    return(
                                        <button className="likes-kinds-buttons" 
                                                key={index}
                                                onClick={this.changeKind}>                                        
                                            {value}
                                        </button>
                                    )
                                })}
                            </div>
                        }
                        {(this.state.error) && 
                            <div className="error-message">
                                No likes found...
                            </div>
                        }
                        {this.state.likesList.length>0 &&
                            this.state.likesList.map((value, index) => {
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