import React, { useState, useEffect } from 'react';
import { isLogged } from '../api/api';
import ExploreScroll from '../Components/Explore/ExploreScroll';
import MyNavbar from '../Components/Navbars/MyNavbar';
import MobileNavbar from '../Components/Navbars/MobileNavbar';
import Searchbar from '../Components/Searchbar/Searchbar';

function ExplorePage() {
    const [userId, setUserId] = useState(null);
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1);

    useEffect(() => {
        isLogged()
        .then((response) => {
            setUserId(response.data.id);
        })
        .catch(() => {
            ;
        })
    }, [])

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
            <div className="main-home-container flex-layout" style={{'paddingBottom': '50px'}}>
                <ExploreScroll
                    userId={userId}
                    logged={userId!==null}
                    updateMyPar={()=>{}}
                    case='single-page'
                />
            </div>
        </div>
    )

}

export default ExplorePage;