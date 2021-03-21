import React from 'react';
import './Home.css';

import MyNavbar from './MyNavbar'

class Home extends React.Component {

    render() {
        return (
            <div className="all-page">
                <MyNavbar />
            </div>
        )
    }
}

export default Home;