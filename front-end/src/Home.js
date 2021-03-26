import React from 'react';
import './Home.css';
import MyNavbar from './MyNavbar'

import {isLogged, getFollows, getFollowers} from './api';
import Posts from "./Posts";
import Explore from './Explore';
import ProfileBox from './ProfileBox';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
            error: null,
            followsList: [],
            followersList: [],
            update1: 1,
        }
        this.askFollows = this.askFollows.bind(this);
        this.updateHome = this.updateHome.bind(this);
    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            })
            setTimeout(()=>{this.askFollows()}, 1000);
        })
        .catch(err => {
            console.log(err)
            this.setState({
                error: "Not logged in"
            })
        })
    }

    updateHome = () => {
        this.setState({
            update1: this.state.update1+1,
        })
    }


    askFollows = () => {
/*
        setTimeout(()=>{
            getFollows(this.state.userId)
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
            getFollowers(this.state.userId)
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
*/
    }

    render() {
        return (
            <div className="all-page">
                <MyNavbar />
                <div className="main-home-container flex-layout">
                    <Explore userId={this.state.userId} logged={this.state.logged} update1={this.state.update1} />
                    <Posts case="all" updateHome={this.updateHome} />
                    {this.state.logged &&
                        <ProfileBox userId={this.state.userId} logged={this.state.logged} />
                    }
                </div>
            </div>
        )
    }
}

export default Home;