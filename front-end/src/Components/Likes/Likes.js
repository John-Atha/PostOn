import React, { useState, useEffect } from "react";
import "./Likes.css";
import { getLikes, getFollowers, getFollows } from '../../api/api';
import OutsideClickHandler from 'react-outside-click-handler';
import Button from "react-bootstrap/esm/Button";
import OneUserLine from "../Profile/OneUserLine";

function Likes(props) {
    const [userId, setUserId] = useState(props.userId);
    const [logged, setLogged] = useState(props.logged);
    const [error, setError] = useState(null);
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(5);
    const [likesList, setLikesList] = useState([]);
    const [followsList, setFollowsList] = useState([]);
    const [followsObjIdList, setFollowsObjIdList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [showMe, setShowMe] = useState(props.showMe);
    const [kind, setKind] = useState(props.kinds[0]);
    const [kinds, setKinds] = useState(props.kinds);


    const changeKind = (event) => {
        setKind(event.target.innerHTML);
        setLikesList([]);
        setStart(1);
        setEnd(5);
        setError(null);
    }

    const previousPage = () => {
        setLikesList([]);
        setStart(start-5);
        setEnd(end-5);
    }

    const nextPage = () => {
        setLikesList([]);
        setStart(start+5);
        setEnd(end+5);
    }

    const askLikes = () => {
        console.log('I am asking likes');
        getLikes(start, end, props.id, props.on, kind)
        .then(response => {
            setLikesList(response.data);
            setError(null);
        })
        .catch(() => {
            setError(`No ${kind} reactions found.`)
        })
    }

    const hide = (event) => {
        event.preventDefault();
        setShowMe(false);
    }

    useEffect(() => {
        setUserId(props.userId);
        setLogged(props.logged);
        setShowMe(props.showMe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.userId, props.logged])

    useEffect(() => {
        askFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    useEffect(() => {
        setShowMe(props.showMe);
        setFollowsList([]);
        setFollowersList([]);
        setFollowsObjIdList([]);
        setTimeout(() => askFollows(), 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.followsUpd])

    useEffect(() => {
        askLikes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start])

    useEffect(() => {
        askLikes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kind])

    useEffect(() => {
        setKinds(props.kinds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.kinds])


    const askFollows = () => {
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
        .catch(() => {
            ;
        });
    }

    const updateFollows = () => {
        setFollowsList([]);
        setFollowsObjIdList([]);
        setFollowersList([]);
        setTimeout(()=>askFollows(), 500);
        props.updateHome();
    }


    if (showMe) {
        let classN = "likes-pop-up center-content";
        if (props.on==="comment") {
            classN = "likes-comments-pop-up center-content";
        }
        return (
            <OutsideClickHandler onOutsideClick={hide}>
                <div className={classN} style={{'paddingBottom': '5px'}}>
                    <button className="close-button" onClick={hide}>X</button>
                    {props.on==='comment' &&
                        <h5>Likes</h5>
                    }
                    {props.on==='post' &&
                        <div className="flex-layout center-content" style={{'marginBottom': '10px'}}>
                            {kinds.map((value, index) => {
                                return(
                                    <Button variant={value===kind ? "success" : "outline-success"}
                                            className="likes-kinds-buttons" 
                                            key={index}
                                            onClick={changeKind}>                                        
                                        {value}
                                    </Button>
                                )
                            })}
                        </div>
                    }
                    <hr />
                    {error && 
                        <div className="error-message">
                            No likes found...
                        </div>
                    }
                    {likesList.length>0 &&
                        likesList.map((value, index) => {
                            if (followsList.includes(value.owner.id)) {
                                return (
                                    <OneUserLine key={index}
                                            user={value.owner} 
                                            me={userId}
                                            logged={logged}
                                            followId={followsObjIdList[followsList.indexOf(value.owner.id)]}
                                            followed={true}
                                            updatePar={updateFollows}
                                            case='profile' />
                                )
                            }
                            else if (!followsList.includes(value.owner.id) && followersList.includes(value.owner.id)) {
                                return (
                                    <OneUserLine key={index}
                                            user={value.owner}
                                            me={userId} 
                                            logged={logged} 
                                            followed={false} 
                                            following={true}
                                            updatePar={updateFollows}
                                            case='profile' />
                                )
                            }

                            else {
                                return (
                                    <OneUserLine key={index}
                                            user={value.owner}
                                            me={userId} 
                                            logged={logged} 
                                            followed={false} 
                                            following={false}
                                            updatePar={updateFollows}
                                            case='profile' />
                                )
                            }
                        })
                    }
                    {likesList.length>0 &&
                        <div className="pagi-buttons-container flex-layout center-content">
                            {start !== 1 &&
                                <Button variant='primary' className="margin" onClick={previousPage}>Previous</Button>                        
                            }
                            {likesList.length >= 5 &&
                                <Button variant='primary' className="margin" onClick={nextPage}>Next</Button>                        
                            }
                        </div>
                    }
                </div>
            </OutsideClickHandler>
        )
    }
    else {
        return (
            null
        )
    }
}

export default Likes;