import React, { useState, useEffect } from 'react';
import ProfileCard from '..//Profile/ProfileCard';
import '../../Pages/Activity/Activity.css';
import { dateShow } from './methods';

function FollowAction(props) {
    const [action, setAction] = useState(props.action);
    const [showingCard, setShowingCard] = useState(false);

    useEffect(() => {
        setAction(props.action);
    }, [props.action])

    return(
        <div className="one-activity-container">
            {action.following && action.followed && action.date && 
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        On {dateShow(action.date)}, you followed the user
                    </div>
                    <div className="as-link with-whitespace"
                                onMouseEnter={()=>setShowingCard(true)}
                                onMouseLeave={()=>setShowingCard(false)}>
                        {" "+action.followed.username}
                        {showingCard &&
                                <ProfileCard
                                    user={action.followed}
                                    position={"right"}
                                />
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default FollowAction;