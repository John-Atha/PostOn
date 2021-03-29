import React from 'react';
import './Profile.css';
import user_icon from './images/user-icon.png'; 

import MyNavbar from './MyNavbar';
import Posts from './Posts';
import {getUser, getFollowersCount, getFollowsCount, getFollows, getFollowers} from './api';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: false,
            username: null,
            moto: null,
            country: null,
            photo: null,
            followsNum: 0,
            followersNum: 0,
            postsList: [],
        }
        this.countFollows = this.countFollows.bind(this);
        this.countFollowers = this.countFollowers.bind(this);
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

    componentDidMount() {
        getUser(this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                username: response.data.username,
                moto: response.data.moto,
                country: response.data.country.title,
                //photo....
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "Sorry, we could not find user's profile."
            })
        })
        this.countFollowers();
        this.countFollows();
    }


    render() {
        return(
            <div className="all-page">
                <MyNavbar />
                <div className="profile-main center-content">
                        <div className="profile-username margin-top-smaller">
                            {this.state.username}
                        </div>
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
                            <div className="margin-right">
                                Followers: {this.state.followersNum}
                            </div>
                            <div className="margin-left">
                                Follows: {this.state.followsNum}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-layout">
                    <div className="follows-box flex-item-small">
                        asgfaga
                        ga
                        dge
                        gaegaeughaeugaeg
                        ae
                        gaegaeiuvf
                    </div>
                    <Posts whose={this.state.userId} />
                    <div className="follows-box flex-item-small">
                        asgfaga
                        ga
                        dge
                        gaegaeughaeugaeg
                        ae
                        gaegaeiuvf
                    </div>
                </div>
                </div>
            
        )
    }
}

export default Profile;