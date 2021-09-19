import React , { useState } from 'react';
import './Home/Home.css';
import MyNavbar from '../Components/Navbars/MyNavbar';
import MobileNavbar from '../Components/Navbars/MobileNavbar';
import Searchbar from '../Components/Searchbar/Searchbar';

function NotFound() {
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1);

    const updateNavbarsColors = () => {
        setUpdateColorsBetweenNavbars(updateColorsBetweenNavbars+1)
    }

    return(
        <div className="all-page">
            { window.innerWidth<500 &&
                <MobileNavbar updateColors={()=>{updateNavbarsColors();}} />
            }
            <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
            <Searchbar />
            <div className="center-content" style={{'marginTop': '160px'}}>
                <div className="error-message">
                    Sorry, page not found!
                </div>
            </div>
        </div>
    )
}

export default NotFound;