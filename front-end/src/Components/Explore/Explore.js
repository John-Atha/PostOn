import React, { useState, useEffect } from 'react';
import './Explore.css'
import { getUsers, getFollows, getFollowers } from '../../api/api';
import Button from 'react-bootstrap/esm/Button';
import OneUserLine from '../Profile/OneUserLine';

function Explore(props) {
    const [userId, setUserId] = useState(props.userId);
    const [error, setError] = useState(null);
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(10);
    const [usersList, setUsersList] = useState([]);
    const [followsList, setFollowsList] = useState([]);
    const [followsObjIdList, setFollowsObjIdList] = useState([]);
    const [followersList, setFollowersList] = useState([]);

    let first = true;
    
    const moveOn = () => {
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        askUsers();
    }

    const previousPage = () => {
        setStart(start-10);
        setEnd(end-10);
    }

    const nextPage = () => {
        setStart(start+10);
        setEnd(end+10);
    }

    const askFollows = () => {
        if (userId) {
            getFollows(userId)
            .then(response => {
                let tempFollowsList = [];
                let tempFollowsObjIdList = [];
                response.data.forEach(el=> {
                    tempFollowsList.push(el.followed.id);
                    tempFollowsObjIdList.push(el.id);
                })
                setFollowsList(tempFollowsList);
                setFollowsObjIdList(tempFollowsObjIdList);
            })
            .catch(() => {
                ;
            })
            getFollowers(userId)
            .then(response => {
                let tempFollowersList = [];
                response.data.forEach(el=> {
                    tempFollowersList.push(el.following.id);
                })
                setFollowersList(tempFollowersList);
            })
            .catch(err => {
                ;
            });
        }
    }

    const askUsers = () => {
        getUsers(start, end)
        .then(response => {
            setUsersList(response.data);
            if(first) {
                askFollows();
                first = false;
            }
        })
        .catch(() => {
            setError("No more users found");
        })        
    }

    const updateFollows = () => {
        setFollowsList([]);
        setFollowsObjIdList([]);
        setFollowersList([]);
        props.updateMyPar();
        setTimeout(()=>{ askFollows() }, 500);
    }

    useEffect(() => {
        setUserId(props.userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.userId])

    useEffect(() => {
        askUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    useEffect(() => {
        updateFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersList])

    useEffect(() => {
        updateFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.update1])

    useEffect(() => {
        moveOn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end])

    return(
        <div className="explore-container center-content">
            <h5>Explore</h5>
            {
                usersList.length!==0 && usersList.map((value, index) => {
                    if (value.id!==userId) {
                        if (followsList.includes(value.id)) {
                            return (
                                <OneUserLine 
                                            key={index}
                                            user={value}
                                            me={userId}
                                            logged={props.logged}
                                            followId={followsObjIdList[followsList.indexOf(value.id)]}
                                            followed={true}
                                            updatePar={updateFollows}
                                            case='explore'
                                />
                            )
                        }
                        else if(!followsList.includes(value.id) && followersList.includes(value.id)) {
                            return (
                                <OneUserLine
                                        key={index}
                                        user={value}
                                        me={userId} 
                                        logged={props.logged} 
                                        followed={false} 
                                        following={true}
                                        updatePar={updateFollows}
                                        case='explore'
                                />
                            )    
                        }
                        else {
                            return (
                                <OneUserLine
                                        key={index} 
                                        user={value} 
                                        me={userId} 
                                        logged={props.logged} 
                                        followed={false} 
                                        following={false}
                                        updatePar={updateFollows}
                                        case='explore'
                                />
                            )    
                        }
                    }
                    else {
                        return(
                            <div key={index}></div>
                        )
                    }
                    })
            }
            {usersList.length!==0 && 
                <div className="pagi-buttons-container flex-layout center-content">
                    {start !== 1 &&
                        <Button variant='dark' className="flex-item-small margin" onClick={previousPage}>Previous</Button>                
                    }
                    {usersList.length>=10 &&
                        <Button variant='dark' className="flex-item-small margin" onClick={nextPage}>Next</Button>                
                    }
                </div>            
            }
            {usersList.length === 0 &&
                <div className="error-message margin-top center-text">{error}</div>
            }
        </div>
    )
}

export default Explore;