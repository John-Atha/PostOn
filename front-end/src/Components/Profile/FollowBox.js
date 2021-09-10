import React, { useState, useEffect } from 'react';
import '../../Pages/Profile/Profile.css';
import OutsideClickHandler from 'react-outside-click-handler';
import OneUserLine from './OneUserLine';
import { getFollowsPagi, getFollowersPagi } from '../../api/api';
import Button from 'react-bootstrap/esm/Button';

function FollowBox(props) {
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(5);
    const [hisFollowsList, setHisFollowsList] = useState([]);
    const [hisFollowersList, setHisFollowersList] = useState([]);
    const [followsError, setFollowsError] = useState(null);
    const [followersError, setFollowersError] = useState(null);

    useEffect(() => {
        askHisFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=> {
        askHisFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end])
    
    const hide = (event) => {
        if (props.case==="follows") {
            props.hideFollows();
        }
        else{
            props.hideFollowers();
        }
        event.preventDefault();
    }

    const previousPage = () => {
        setStart(start-5);
        setEnd(end-5);
        setFollowsError(null);
        setFollowersError(null);
    }

    const nextPage = () => {
        setStart(start+5);
        setEnd(end+5);
        setFollowsError(null);
        setFollowersError(null);
    }

    const askHisFollows = () => {
        if (props.case==="follows") {
            getFollowsPagi(parseInt(props.userId), start, end)
            .then(response => {
                setHisFollowsList(response.data);
                setFollowsError(null);
            })
            .catch(err => {
                setFollowsError("No more follows found from this user.");
            });
        }
        else if (props.case==="followers") {
            getFollowersPagi(parseInt(props.userId), start, end)
            .then(response => {
                setHisFollowersList(response.data);
            })
            .catch(() => {
                setFollowersError("No more followers found for this user.");
            });
        }
    }

    if (props.case==="follows" && hisFollowsList.length) {
        return(
            <OutsideClickHandler onOutsideClick={hide} >
                <div className="follows-pop-up center-content">
                {(followsError) && 
                    <div className="error-message">
                        {followsError}
                    </div>
                }
                {!followsError &&
                    hisFollowsList.map((value, index) => {
                        if(props.myFollowsList.includes(value.followed.id)) {
                            return (
                                <OneUserLine key={index}
                                            user={value.followed}
                                            me={props.me}
                                            logged={props.logged}
                                            followId={props.myFollowsObjIdList[props.myFollowsList.indexOf(value.followed.id)]}
                                            followed={true}
                                            updatePar={props.updateMyFollows} />
                            )
                        }
                        else if(!hisFollowsList.includes(value.followed.id) &&
                                    props.myFollowersList.includes(value.followed.id)) {
                                    return(
                                        <OneUserLine key={index}
                                                    user={value.followed}
                                                    me={props.me}
                                                    logged={props.logged}
                                                    followed={false}
                                                    following={true}
                                                    updatePar={props.updateMyFollows} />
                                    )
                        }
                        else {
                            return(
                                <OneUserLine key={index}
                                            user={value.followed}
                                            me={props.me}
                                            logged={props.logged}
                                            followed={false}
                                            following={false}
                                            updatePar={props.updateMyFollows} />
                            )
                        }
                    })
                }
                {hisFollowsList.length>0 &&
                    <div className="pagi-buttons-container flex-layout center-content">
                        <Button variant='outline-primary' disabled={start===1}    className="margin" onClick={previousPage}>Previous</Button>
                        <Button variant='outline-primary' disabled={followsError} className="margin" onClick={nextPage}>Next</Button>
                    </div>
                }            
                </div>
            </OutsideClickHandler>
        )
    }
    else if (props.case==="followers" && hisFollowersList.length) {
        return(
            <OutsideClickHandler onOutsideClick={hide}>
                <div className="follows-pop-up center-content">
                    {(followersError) && 
                        <div className="error-message">
                            {followersError}
                        </div>
                    }
                    {!followsError &&
                        hisFollowersList.map((value, index) => {
                            if(props.myFollowsList.includes(value.following.id)) {
                                return (
                                    <OneUserLine key={index}
                                                user={value.following}
                                                me={props.me}
                                                logged={props.logged}
                                                followId={props.myFollowsObjIdList[props.myFollowsList.indexOf(value.following.id)]}
                                                followed={true}
                                                updatePar={props.updateMyFollows} />
                                )

                            }
                            else if(!props.myFollowsList.includes(value.following.id) &&
                                        props.myFollowersList.includes(value.following.id)) {
                                        return(
                                            <OneUserLine key={index}
                                                        user={value.following}
                                                        me={props.me}
                                                        logged={props.logged}
                                                        followed={false}
                                                        following={true}
                                                        updatePar={props.updateMyFollows} />
                                        )
                            }
                            else {
                                return (
                                    <OneUserLine key={index}
                                                user={value.following}
                                                me={props.me}
                                                logged={props.logged}
                                                followed={false}
                                                following={false}
                                                updatePar={props.updateMyFollows} />
                                )
                            }
                        })
                    }
                    {hisFollowersList.length>0 &&
                        <div className="pagi-buttons-container flex-layout center-content">
                            <Button variant='outline-primary' disabled={start===1}      className="margin" onClick={previousPage}>Previous</Button>
                            <Button variant='outline-primary' disabled={followersError} className="margin" onClick={nextPage}>Next</Button>
                        </div>
                    }            
                </div>
            </OutsideClickHandler>
        )
    }
    else {
        return(
            null
        )
    }
}

export default FollowBox;