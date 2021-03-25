import React from 'react';
import './ProfileBox.css'

import user_icon from './images/user-icon.png'; 

import {getUser, getFollowersCount, getFollowsCount} from './api';

class ProfileBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            username: null,
            email: null,
            followers: null,
            follows: null,
        }
        this.load = this.load.bind(this);
    }

    load = () => {
        getUser(this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                username: response.data.username,
                email:response.data.email,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "Sorry, we could not find info for your account.",
            })
        })
        getFollowersCount(this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                followers: response.data.followers,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                followers: "-",
            })
        })
        getFollowsCount(this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                follows: response.data.follows,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                follows: "-",
            })
        })
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId!==this.props.userId) {
            this.load();
        }
    }

    render() {
        return (
            <div className="profile-summary flex-item">
                <div className="user-photo-container-small">
                    <img className="user-photo" src={user_icon} alt="user profile" />
                </div>
                <div className="one-user-line">Username: {this.state.username}</div>
                <div className="one-user-line">Email: {this.state.email}</div>
                <div className="one-user-line">Followers: {this.state.followers}</div>
                <div className="one-user-line">Follows: {this.state.follows}</div>
            </div>
        )
    }
}

export default ProfileBox;