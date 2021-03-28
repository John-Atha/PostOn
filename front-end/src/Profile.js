import React from 'react';
import './Profile.css';

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
                <div className="main-page">
                    <div className="profile-info">
                        <div>
                            {this.state.username}
                        </div>
                        <div>
                            moto: {this.state.moto}
                        </div>
                        <div>
                            country: {this.state.country}
                        </div>
                        <div>
                            Followers: {this.state.followersNum}
                        </div>
                        <div>
                            Follows: {this.state.followsNum}
                        </div>
                    </div>
                    <Posts whose={this.state.userId} />
                </div>
            </div>
        )
    }
}

export default Profile;