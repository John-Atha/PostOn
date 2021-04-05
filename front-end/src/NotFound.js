import React from 'react';
import './Home.css';
import MyNavbar from './MyNavbar';
import Searchbar from './Searchbar';

class NotFound extends React.Component {
    render() {
        return(
            <div className="all-page">
                <MyNavbar />
                <Searchbar />
                <div className="center-content margin-top">
                    <div className="error-message">
                        Sorry, page not found!
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFound;