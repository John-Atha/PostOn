import React, { useState, useEffect } from 'react';
import './ProfileCard.css';
import verified from '../../images/verified.png';
import { getFollowsCount, getFollowersCount } from '../../api/api';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function ProfileCard(props) {
    const [user, setUser] = useState(props.user);
    const [followsCount, setFollowsCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);

    const countFollows = () => {
        if (user) {
            getFollowsCount(user.id)
            .then(response => {
                setFollowsCount(response.data.follows);
            })
            .catch(() => {
                setFollowsCount(0);
            })
        }
        else {
            setFollowsCount(0);
        }
    }

    const countFollowers = () => {
        if (user) {
            getFollowersCount(user.id)
            .then(response => {
                setFollowersCount(response.data.followers);
            })
            .catch(() => {
                setFollowersCount(0);
            })    
        }
        else {
            setFollowersCount(0);
        }
    }

    useEffect(() => {
        setUser(props.user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user])

    useEffect(() => {
        countFollows();
        countFollowers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    if (user) {
        return(
            <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className={`profile-card pos-${props.position} center-content`}>
                <Card.Img variant="top" src={user.photo} className="user-photo-container"/>
                <Card.Body style={{padding:'0%'}}>
                    <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>
                        {user.username}
                        {user.verified===true &&
                                <img className="verified-icon" src={verified} alt="verified" />
                        }
                    </Card.Title>
                    <Card.Text>
                        {followersCount} followers<br></br>
                        {followsCount} following<br></br>
                    </Card.Text>
                    <Button variant="primary" style={{padding:'1%'}} onClick={()=>window.location.href=`/users/${user.id}`}>See profile</Button>
                </Card.Body>
            </Card>
        )    
    }
    else {
        return null;
    }
}

export default ProfileCard;