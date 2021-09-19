import React, { useState, useEffect } from 'react';
import ProfileCard from '..//Profile/ProfileCard';
import '../../Pages/Activity/Activity.css';
import { dateShow, format } from './methods';

function CommentLikeAction(props) {
    const [action, setAction] = useState(props.action);
    const [showingCard, setShowingCard] = useState(false);

    useEffect(() => {
        setAction(props.action);
    }, [props.action])

    return(
        <div className="one-activity-container">
            {action.owner && action.comment && action.date &&
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        {`On ${dateShow(action.date)}, you liked `}
                    </div>
                    {action.comment.owner.id===action.owner.id &&
                        "one of your"
                    }
                    {action.comment.owner.id===action.owner.id &&
                        <a href={`/posts/${action.comment.post.id}`} className="with-whitespace">
                            {" comments "}
                        </a>
                    }
                    {action.comment.owner.id!==action.owner.id &&
                        <a href={`/posts/${action.comment.post.id}`} className="with-whitespace">
                            {" a comment "}
                        </a>
                    }
                    {action.comment.owner.id!==action.owner.id &&
                        <div>
                            of user 
                        </div>
                    }
                    {action.comment.owner.id!==action.owner.id &&
                        <div className="as-link with-whitespace"
                            onMouseEnter={()=>setShowingCard(true)}
                            onMouseLeave={()=>setShowingCard(false)}>
                            {" "+action.comment.owner.username}
                            {showingCard &&
                                    <ProfileCard
                                        user={action.comment.owner}
                                        position={"right"}
                                    />
                            }
                        </div>
                    }
                </div>
            }
            {action.owner && action.comment && action.date &&
                <div className="margin-top-smaller">
                    {format(action.comment.text)}
                </div>
            }
        </div>
    )
}

export default CommentLikeAction;