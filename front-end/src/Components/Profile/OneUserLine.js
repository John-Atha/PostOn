
import React, { useState, useEffect } from 'react';
import '../../Pages/Profile/Profile.css';
import ProfileCard from  '../../Components/Profile/ProfileCard';
import Button from 'react-bootstrap/esm/Button';
import verified_img from '../../images/verified.png';
import { followUser, unfollowUser } from '../../api/api';

function OneUserLine(props) {
    const [user, setUser] = useState(props.user);
    const [logged, setLogged] = useState(props.logged);
    const [showCard, setShowCard] = useState(false);

    const follow = () => {
        followUser(props.me, user.id)
        .then(() => {
            props.updatePar();
        })
        .catch(() => {
            props.updatePar();
        })
    }
    
    const unfollow = () => {
        unfollowUser(props.followId)
        .then(() => {
            props.updatePar();
        })
        .catch(() => {
            props.updatePar();
        })
    }

    useEffect(() => {
        setUser(props.user);
        setLogged(props.logged);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user, props.followed, props.following])


    return(
        <div className="one-like flex-layout center-content">
            <div className="like-owner flex-item-small flex-layout center-content"                        
                    onMouseEnter={()=>setShowCard(true)}
                    onMouseLeave={()=>setShowCard(false)}>
                <div className="user-photo-container-small"
                                onMouseEnter={()=>setShowCard(true)}
                                onMouseLeave={()=>setShowCard(false)} >
                    <img className="user-photo" src={user.photo} alt="user profile" />
                </div>
                <div className="owner-name">
                        {user.username}
                        {user.verified===true &&
                            <img className="verified-icon" src={verified_img} alt="verified" />
                        }
                </div>
                {showCard &&
                    <ProfileCard id={user.id}
                            username={user.username}
                            moto={user.moto}
                            photo={user.photo}
                            verified={user.verified}
                            position={"bottom"} />
                }
            </div>
            {logged &&
                <div className="un-follow-button-container flex-item-small">
                {!props.followed && !props.following && props.me!==props.user.id &&
                    <Button variant='primary' className="my-button un-follow-button pale-blue" onClick={follow}>Follow</Button>
                }
                {!props.followed && props.following && props.me!==props.user.id &&
                    <Button variant='primary' className="my-button un-follow-button pale-blue" onClick={follow}>Follow Back</Button>
                }
                {props.followed && props.me!==props.user.id &&
                    <Button variant='outline-primary' className="my-button un-follow-button" onClick={unfollow}>Unfollow</Button>
                }
                </div>
            }
        </div>
    )
}

export default OneUserLine;