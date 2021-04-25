import React from 'react';
import './Home.css';
import MyNavbar from './MyNavbar'
import {isLogged} from './api';
import Posts from "./Posts";
import Explore from './Explore';
import Searchbar from './Searchbar';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
            error: null,
            update1: 1,
            update2: 1,
        }
        this.updateHome = this.updateHome.bind(this);
        this.updateProfBox = this.updateProfBox.bind(this);
    }
    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
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
    updateProfBox = () => {
        this.setState({
            update2: this.state.update2+1,
        })
    }
    updateHome = () => {
        this.setState({
            update1: this.state.update1+1,
        })
    }
    render() {
        return (
            <div className="all-page">
                <MyNavbar />
                <Searchbar />
                <div className="main-home-container flex-layout">
                    <Explore userId={this.state.userId} logged={this.state.logged} update1={this.state.update1} updateMyPar={this.updateProfBox} />
                    <Posts case="all" updateHome={this.updateHome} />
                </div>
            </div>
        )
    }
}

export default Home;