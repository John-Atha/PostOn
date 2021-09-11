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
    const [myFollowsList, setMyFollowsList] = useState(props.myFollowsList);
    const [myFollowsObjIdList, setMyFollowsObjIdList] = useState(props.myFollowsObjIdList);
    const [myFollowersList, setMyFollowersList] = useState(props.myFollowersList);

    useEffect(() => {
        askHisFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=> {
        askHisFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end])

    useEffect(() => {
        setMyFollowsList(props.myFollowsList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.myFollowsList])

    useEffect(() => {
        setMyFollowsObjIdList(props.myFollowsObjIdList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.myFollowsObjIdList])

    useEffect(() => {
        setMyFollowersList(props.myFollowersList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.myFollowersList])
    
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
                        if(myFollowsList.includes(value.followed.id)) {
                            return (
                                <OneUserLine key={index}
                                            user={value.followed}
                                            me={props.me}
                                            logged={props.logged}
                                            followId={myFollowsObjIdList[myFollowsList.indexOf(value.followed.id)]}
                                            followed={true}
                                            updatePar={props.updateMyFollows}
                                            case='profile' />
                            )
                        }
                        else if(!hisFollowsList.includes(value.followed.id) &&
                                    myFollowersList.includes(value.followed.id)) {
                                    return(
                                        <OneUserLine key={index}
                                                    user={value.followed}
                                                    me={props.me}
                                                    logged={props.logged}
                                                    followed={false}
                                                    following={true}
                                                    updatePar={props.updateMyFollows}
                                                    case='profile' />
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
                                            updatePar={props.updateMyFollows}
                                            case='profile' />
                            )
                        }
                    })
                }
                {hisFollowsList.length>0 &&
                    <div className="pagi-buttons-container flex-layout center-content">
                        {start !== 1 && 
                            <Button variant='outline-primary' className="margin" onClick={previousPage}>Previous</Button>                        
                        }
                        {!followsError &&
                            <Button variant='outline-primary' className="margin" onClick={nextPage}>Next</Button>                        
                        }
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
                            if(myFollowsList.includes(value.following.id)) {
                                return (
                                    <OneUserLine key={index}
                                                 user={value.following}
                                                 me={props.me}
                                                 logged={props.logged}
                                                 followId={myFollowsObjIdList[myFollowsList.indexOf(value.following.id)]}
                                                 followed={true}
                                                 updatePar={props.updateMyFollows}
                                                 case='profile' />
                                )

                            }
                            else if(!myFollowsList.includes(value.following.id) &&
                                        myFollowersList.includes(value.following.id)) {
                                        return(
                                            <OneUserLine key={index}
                                                        user={value.following}
                                                        me={props.me}
                                                        logged={props.logged}
                                                        followed={false}
                                                        following={true}
                                                        updatePar={props.updateMyFollows}
                                                        case='profile' />
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
                                                updatePar={props.updateMyFollows}
                                                case='profile' />
                                )
                            }
                        })
                    }
                    {hisFollowersList.length>0 &&
                        <div className="pagi-buttons-container flex-layout center-content">
                            {start !== 1 &&
                                <Button variant='outline-primary' className="margin" onClick={previousPage}>Previous</Button>                        
                            }
                            {!followersError &&
                                <Button variant='outline-primary' className="margin" onClick={nextPage}>Next</Button>                            
                            }
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