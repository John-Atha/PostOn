import React, { useState, useEffect } from 'react';
import ProfileCard from '../Profile/ProfileCard';
import '../../Pages/Activity/Activity.css';
import { dateShow } from './methods';

function PostLikeAction(props) {
    const [action, setAction] = useState(props.action);
    const [showingCard, setShowingCard] = useState(false);

    useEffect(() => {
        setAction(props.action);
    }, [props.action])
   
    return(
        <div className="one-activity-container">
            {action.post && action.owner && action.date &&
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        {`On ${dateShow(action.date)}, you reacted on `}
                    </div>
                    {action.post.owner.id===action.owner.id &&
                        "one of your"
                    }
                    {action.post.owner.id===action.owner.id &&   
                        <a href={`/posts/${action.post.id}`} className="with-whitespace">
                            {" posts."}
                        </a>
                    }
                    {action.post.owner.id!==action.owner.id &&   
                        <a href={`/posts/${action.post.id}`} className="with-whitespace">
                            {"a post "}
                        </a>
                    }
                    {action.post.owner.id!==action.owner.id &&   
                        <div>
                            of user 
                        </div>
                    }
                    {action.post.owner.id!==action.owner.id &&
                        <div className="as-link with-whitespace"
                            onMouseEnter={()=>setShowingCard(true)}
                            onMouseLeave={()=>setShowingCard(false)}>
                            {" "+action.post.owner.username}
                            {showingCard &&
                                    <ProfileCard
                                        user={action.post.owner}
                                        position={"right"} 
                                    />
                            }
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default PostLikeAction;