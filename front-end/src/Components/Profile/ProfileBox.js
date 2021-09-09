import React from 'react';
import './ProfileBox.css'
import { getUser, getFollowersCount, getFollowsCount } from '../../api/api';

class ProfileBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            username: null,
            photo: null,
            email: null,
            followers: null,
            follows: null,
        }
        this.load = this.load.bind(this);
        this.countFollows = this.countFollows.bind(this);
        this.countFollowers = this.countFollowers.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }
    countFollows = () => {
        getFollowsCount(this.state.userId)
        .then(response => {
            //console.log(response);
            this.setState({
                follows: response.data.follows,
            })
        })
        .catch(err => {
            //console.log(err);
            this.setState({
                follows: "-",
            })
        })
    }
    countFollowers = () => {
        getFollowersCount(this.state.userId)
        .then(response => {
            //console.log(response);
            this.setState({
                followers: response.data.followers,
            })
        })
        .catch(err => {
            //console.log(err);
            this.setState({
                followers: "-",
            })
        })
    }
    getUserInfo = () => {
        getUser(this.state.userId)
        .then(response => {
            //console.log(response);
            this.setState({
                username: response.data.username,
                photo: response.data.photo,
                email:response.data.email,
            })
        })
        .catch(err => {
            //console.log(err);
            this.setState({
                error: "Sorry, we could not find info for your account.",
            })
        })
    }
    load = () => {
        this.getUserInfo();
        this.countFollowers();
        this.countFollows();
    }
    componentDidMount() {
        this.load();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.userId!==this.props.userId) {
            this.load();
        }
        if (prevProps.update1!==this.props.update1 || prevProps.update2!==this.props.update2) {
            this.countFollowers();
            this.countFollows();
        }
    }
    render() {
        return (
            <div className="profile-box">
                <div className="flex-layout">
                    <div className="user-photo-container-small">
                            <img className="user-photo" src={this.state.photo} alt="user" />
                    </div>
                    <div className="owner-name">{this.state.username}</div>
                </div>
                <div className="one-user-line">Email: {this.state.email}</div>
                <div className="one-user-line">Followers: {this.state.followers}</div>
                <div className="one-user-line">Follows: {this.state.follows}</div>
            </div>
        )
    }
}

export default ProfileBox;