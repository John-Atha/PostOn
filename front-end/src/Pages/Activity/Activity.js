import React, { useState, useEffect } from 'react';
import {isLogged, getActivity} from '../../api/api';
import './Activity.css';
import MyNavbar from '../../Components/Navbars/MyNavbar';
import MobileNavbar from '../../Components/Navbars/MobileNavbar';
import Searchbar from '../../Components/Searchbar/Searchbar';
import Button from 'react-bootstrap/esm/Button';
import CommentAction from '../../Components/Activity/CommentAction';
import PostLikeAction from '../../Components/Activity/PostLikeAction';
import CommentLikeAction from '../../Components/Activity/CommentLikeAction';
import PostAction from '../../Components/Activity/PostAction';
import FollowAction from '../../Components/Activity/FollowAction';
import Spinner from 'react-bootstrap/esm/Spinner';

function Activity() {
    const [userId, setUserId] = useState(null);
    const [actionsList, setActionsList] = useState([]);
    const [start, setStart] = useState(1);
    const [error, setError] = useState(false);
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1);

    const askActivity = () => {
        //console.log(`I am asking activity from ${start} to ${start+9}`)
        getActivity(userId, start, start+9)
        .then(response=> {
            setActionsList(response.data);
            setError(false);
        })
        .catch(() => {
            setError(true);
        })
    }

    useEffect(() => {
        isLogged()
        .then(response => {
           setUserId(response.data.id);
           setError(false);
        })
        .catch(() => {
            setError(true);
        })
    }, [])

    useEffect(() => {
        askActivity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    
    const updateNavbarsColors = () => {
        setUpdateColorsBetweenNavbars(updateColorsBetweenNavbars+1);
    }

    return (
        <div className="all-page" style={{'paddingBottom': '55px'}}>
            {window.innerWidth<500 &&
                <MobileNavbar updateColors={()=>{updateNavbarsColors();}} />
            }
            <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
            <Searchbar />
            <div className="main-activity-container flex-layout">
                {actionsList.map((value, index) => {
                    if (value.post && value.text) {
                        return(
                            <CommentAction key={index} action={value} />
                        )
                    }
                    else if (value.comment) {
                        return(
                            <CommentLikeAction key={index} action={value} />
                        )
                    }
                    else if (value.text || value.media) {
                        return(
                            <PostAction key={index} action={value} />
                        ) 
                    }
                    else if (value.following) {
                        return(
                            <FollowAction key={index} action={value} />
                        ) 
                    }
                    else {
                        return(
                            <PostLikeAction key={index} action={value} />
                        )
                    }

                })}
            </div>
            {actionsList.length!==0 &&
                <div className="pagi-buttons-container flex-layout center-content">
                    {start !== 1 &&
                        <Button variant='primary' className="margin" onClick={()=>setStart(start-10)}>Previous</Button>                
                    }
                    {actionsList.length>=10 &&
                        <Button variant='primary' className="margin" onClick={()=>setStart(start+10)}>Next</Button>
                    }
                </div>
            }
            {!actionsList.length && !error &&
                <div style={{'marginBottom': '15px'}} className='center-content margin-top'>
                    <Spinner animation="border" role="status" variant='primary' />
                </div>
            }
            {!actionsList.length && userId!==null && error &&
                <div className="error-message margin-top center-text">Oops, no activity found..</div>
            }
            {!userId && error &&
                <div className="error-message margin-top center-text">You have to create an account to keep track of your activity.</div>
            }
        </div>
    )
}

export default Activity;