import React, { useState, useEffect } from 'react';
import './Statistics.css';
import MyNavbar from '../../Components/Navbars/MyNavbar';
import MobileNavbar from '../../Components/Navbars/MobileNavbar';
import { isLogged } from '../../api/api';
import Searchbar from '../../Components/Searchbar/Searchbar';
import Button from 'react-bootstrap/esm/Button';
import OneCategoryStatistics from '../../Components/Statistics/OneCategoryStatistics';

function Statistics(props) {
    const [choice, setChoice] = useState("Posts");
    const [userId, setUserId] = useState(null);
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1);

    useEffect(() => {
        isLogged()
        .then(response => {
            setUserId(response.data.id);
        })
        .catch(() => {
            ;
        })
    }, [])

    
    const updateNavbarsColors = () => {
        setUpdateColorsBetweenNavbars(updateColorsBetweenNavbars+1);
    }

    if (props.case==="personal" && !userId) {
        return(
            <div className="all-page">
                { window.innerWidth<500 &&
                    <MobileNavbar updateColors={()=>{updateNavbarsColors();}} />
                }
                <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
                <div className="main-page center-content">
                    <div className="error-message">
                        You have to create an account to have your personal statistics page
                    </div>
                </div>
            </div>
        )
    }
    else {
        return(
            <div className="all-page" style={{'paddingBottom': '50px'}}>
                { window.innerWidth<500 &&
                    <MobileNavbar updateColors={()=>{updateNavbarsColors();}} />
                }
                <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
                <Searchbar />
                <div className="main-page center-content">
                    <h4 className="margin-top-smaller">Pick a statistics category</h4>
                    <div className="flex-layout center-content margin-top-smaller">
                        {["Likes", "Comments", "Posts", "Follows"].map((kind, index) => {
                            return(
                                <Button
                                    key={index}
                                    variant={choice===kind ? "primary" : "outline-primary"}
                                    style={{'maxWidth': '100px'}}
                                    className="flex-item stats-choice-button margin"
                                    onClick={()=>setChoice(kind)}>
                                        {kind}
                                </Button>
                            )
                        })}
                    </div>
                    <OneCategoryStatistics
                        choice={choice}
                        case={props.case}
                        userId={userId}
                    />
                </div>
            </div>
        )
    }
}

export default Statistics;