import React from 'react';
import './Home.css';
import MyNavbar from './MyNavbar'

import {isLogged} from './api';
import Posts from "./Posts";
import Explore from './Explore';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
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
        return (
            <div className="all-page">
                <MyNavbar />
                <div className="main-home-container flex-layout">
                    <Explore userId={this.state.userId} logged={this.state.logged} />
                    <Posts case="all"/>
                </div>
            </div>
        )
    }
}

export default Home;