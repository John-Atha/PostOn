import React from 'react';
import './Home/Home.css';
import MyNavbar from '../Components/Navbars/MyNavbar';
import MobileNavbar from '../Components/Navbars/MobileNavbar';
import Searchbar from '../Components/Searchbar/Searchbar';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateColorsBetweenNavbars: 1,
        }
        this.updateNavbarsColors = this.updateNavbarsColors.bind(this);
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
                <div className="center-content" style={{'marginTop': '160px'}}>
                    <div className="error-message">
                        Sorry, page not found!
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFound;