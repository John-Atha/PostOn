import React from 'react';
import './Home.css';
import MyNavbar from './MyNavbar'

import {isLogged} from './api';
import Posts from "./Posts";

class HomeFollowing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: null,
            error: null,
        }
    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response)
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            })
        })
        .catch(err => {
            console.log(err)
            this.setState({
                error: "Not logged in"
            })
        })
    }

    render() {
        if (this.state.logged===true) {
            return (
                <div className="all-page">
                    <MyNavbar />
                    <div className="error-message center-text">{this.state.error}</div>
                    <div className="success-message center-text">{this.state.userId}</div>
                    <Posts case="following"/>
                </div>
            )
        }
        else if (this.state.logged===false) {
            window.location.href="/";
        }
        else {
            return (
                <div className="all-page">
                    <MyNavbar />
                    <div className="error-message center-text margin-top">Loading, please wait...</div>
                </div>
            )
        }
    }
 
}


export default HomeFollowing;