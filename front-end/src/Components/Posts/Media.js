import React, { useState, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import './Posts.css';

function Media(props) {
    const [image, setImage] = useState(props.image);
    const [video, setVideo] = useState(props.video);

    useEffect(() => {
        setImage(props.image);
    }, [props.image])

    useEffect(() => {
        setVideo(props.video);
    }, [props.video])

    return (
        <OutsideClickHandler
            onOutsideClick={()=>props.setShowing(false)}>
            <div className='media-pop-up-container blur'>
                <div className='center-content'>
                    {image &&
                        <img className="media-pop-up" src={image} alt="post media"/>
                    }
                    {video &&
                        <video className="media-pop-up" controls>
                            <source src={video} />
                            Sorry, we couldn't display this video.
                        </video>
                    }
                </div>
                <button className='close-button'
                        style={{'fontSize': 'xx-large'}}
                        onClick={()=>props.setShowing(false)}>
                    X
                </button>
            </div>
        </OutsideClickHandler>
    )
}

export default Media