import React, { useState, useEffect } from 'react';
import '../../Pages/Activity/Activity.css';
import { dateShow } from './methods';

function PostAction(props) {
    const [action, setAction] = useState(props.action);

    useEffect(() => {
        setAction(action);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.action])

    return(
        <div className="one-activity-container">
            {action && action.owner && action.date &&
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        On {dateShow(action.date)}, you uploaded a
                    </div>
                    {action.post!==null &&
                        <a href={`/posts/${action.id}`} className="with-whitespace">
                            {" post "}.
                        </a>
                    }
                </div>
            }
        </div>
    )
}

export default PostAction;