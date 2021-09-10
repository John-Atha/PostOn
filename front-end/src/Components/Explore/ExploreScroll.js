import React, { useState, useEffect } from 'react';
import './Explore.css'
import { getUsers, getFollows, getFollowers } from '../../api/api';
import OneUserLine from '../Profile/OneUserLine';

function ExploreScroll(props) {
    const [userId, setUserId] = useState(props.userId);
    const [error, setError] = useState(null);
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(20);
    const [usersList, setUsersList] = useState([]);
    const [followsList, setFollowsList] = useState([]);
    const [followsObjIdList, setFollowsObjIdList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [asked, setAsked] = useState([]);

    const checkScroll = () => {
        console.log(`${window.scrollY>=0.1*document.body.offsetHeight}`);
        if (window.scrollY>=0.1*document.body.offsetHeight) {
            if (!asked.includes(start)) {
                window.removeEventListener('scroll', checkScroll);
                setTimeout(()=>{window.addEventListener('scroll', checkScroll);}, 2000)
                nextPage();
            }
        }
    }

    const nextPage = () => {
        setStart(start+20);
        setEnd(end+20);
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
            });
            getFollowers(userId)
            .then(response => {
                let tempFollowersList = [];
                response.data.forEach(el=> {
                    tempFollowersList.push(el.following.id);
                })
                setFollowersList(tempFollowersList);
            })
            .catch(() => {
                ;
            });
        }
    }

    const askUsers = () => {
        if (!asked.includes(start)) {
            getUsers(start, end)
            .then(response => {
                setUsersList(usersList.concat(response.data));
                setAsked(asked.concat(start));
            })
            .catch(() => {
                setError("No more users found");
            })                
        }
    }

    const updateFollows = () => {
        props.updateMyPar();
        setTimeout(()=>{ askFollows() }, 500);
    }

    useEffect(() => {
        window.addEventListener('scroll', checkScroll);
        return () => {
            window.removeEventListener('scroll', checkScroll);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setUserId(props.userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.userId])

    useEffect(() => {
        askFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    useEffect(() => {
        askUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, end])

    useEffect(() => {
        updateFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.update1])


    return(
        <div className="explore-page center-content">
            <h5>Explore</h5>
            {
                usersList.length!==0 && usersList.map((value, index) => {
                    if (value.id!==userId) {
                        if (followsList.includes(value.id)) {
                            return (
                                <OneUserLine key={index}
                                            user={value}
                                            me={userId}
                                            logged={props.logged}
                                            followId={followsObjIdList[followsList.indexOf(value.id)]}
                                            followed={true}
                                            updatePar={updateFollows} />
                            )
                        }
                        else if(!followsList.includes(value.id) && followersList.includes(value.id)) {
                            return (
                                <OneUserLine key={index}
                                        user={value}
                                        me={userId} 
                                        logged={props.logged} 
                                        followed={false} 
                                        following={true}
                                        updatePar={updateFollows} />
                            )    
                        }
                        else {
                            return (
                                <OneUserLine key={index} 
                                        user={value} 
                                        me={userId} 
                                        logged={props.logged} 
                                        followed={false} 
                                        following={false}
                                        updatePar={updateFollows} />
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
            {!usersList.length!==0 &&
                <div className="error-message margin-top center-text">{error}</div>
            }
        </div>
    )
}

export default ExploreScroll;