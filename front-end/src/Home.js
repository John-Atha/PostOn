import React from 'react';
import './Home.css';
import MyNavbar from './MyNavbar'

import {isLogged} from './api';

class Home extends React.Component {
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
                <div className="error-message">{this.state.error}</div>
                <div className="success-message">{this.state.userId}</div>
            </div>
        )
    }
}

export default Home;