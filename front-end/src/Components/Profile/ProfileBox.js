import React, { useState, useEffect } from 'react';
import './ProfileBox.css'
import { getUser, getFollowersCount, getFollowsCount } from '../../api/api';

function ProfileBox(props) {
    const [userId, setUserId] = useState(props.userId);
    const [user, setUser] = useState(null);
    const [followsCount, setFollowsCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);

    const countFollows = () => {
        getFollowsCount(userId)
        .then(response => {
            setFollowsCount(response.data.follows);
        })
        .catch(() => {
            setFollowsCount(0)
        })
    }

    const countFollowers = () => {
        getFollowersCount(userId)
        .then(response => {
            setFollowersCount(response.data.followers);
        })
        .catch(() => {
            setFollowersCount(0);
        })
    }

    const getUserInfo = () => {
        getUser(userId)
        .then(response => {
            setUser(response.data);
        })
        .catch(() => {
            ;
        })
    }

    const load = () => {
        getUserInfo();
        countFollowers();
        countFollows();
    }

    useEffect(() => {
        setUserId(props.userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.userId])

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    useEffect(() => {
        countFollows();
        countFollowers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.update1, props.update2])
    
    return (
        <div className="profile-box">
            <div className="flex-layout">
                <div className="user-photo-container-small">
                        <img className="user-photo" src={user ? user.photo : null} alt="user" />
                </div>
                <div className="owner-name">{ user ? user.username : null}</div>
            </div>
            <div className="one-user-line">Email: {user ? user.email : null}</div>
            <div className="one-user-line">Followers: {followersCount || '-'}</div>
            <div className="one-user-line">Follows: {followsCount || '-'}</div>
        </div>
    )
}

export default ProfileBox;