import React from 'react';
import { isLogged } from '../api/api';
import ExploreScroll from '../Components/Explore/ExploreScroll';
import MyNavbar from '../Components/Navbars/MyNavbar';
import MobileNavbar from '../Components/Navbars/MobileNavbar';
import Searchbar from '../Components/Searchbar/Searchbar';

class ExplorePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
            updateColorsBetweenNavbars: 1,
        }
        this.updateNavbarsColors = this.updateNavbarsColors.bind(this);
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
    updateNavbarsColors = () => {
        this.setState({
            updateColorsBetweenNavbars: this.state.updateColorsBetweenNavbars+1,
        })
    }

    render() {
        return(
            <div className="all-page">
                { window.innerWidth<500 &&
                    <MobileNavbar updateColors={()=>{this.updateNavbarsColors();}} />
                }
                <MyNavbar updateMyColors = {this.state.updateColorsBetweenNavbars} />
                <Searchbar />
                <div className="main-home-container flex-layout" style={{'paddingBottom': '50px'}}>
                    <ExploreScroll userId={this.state.userId} logged={this.state.logged} updateMyPar={()=>{}} case='single-page'/>
                </div>
            </div>
        )
    }

}

export default ExplorePage;