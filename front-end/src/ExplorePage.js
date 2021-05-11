import React from 'react';

import { isLogged } from './api';

import ExploreScroll from './ExploreScroll';
import MyNavbar from './MyNavbar';
import MobileNavbar from './MobileNavbar';
import Searchbar from './Searchbar';

class ExplorePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
        }
    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                userId: response.data.id,
                logged: true,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                userId: null,
                logged: false,
            })
        })
    }

    render() {
        return(
            <div className="all-page">
                { window.innerWidth<500 &&
                    <MobileNavbar />
                }
                <MyNavbar />
                <Searchbar />
                <div className="main-home-container flex-layout" style={{'paddingBottom': '50px'}}>
                    <ExploreScroll userId={this.state.userId} logged={this.state.logged} updateMyPar={()=>{}} case='single-page'/>
                </div>
            </div>
        )
    }

}

export default ExplorePage;