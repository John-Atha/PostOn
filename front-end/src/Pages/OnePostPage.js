import React, { useState, useEffect } from 'react';
import MyNavbar from '../Components/Navbars/MyNavbar';
import OnePost from '../Components/Posts/OnePost';
import MobileNavbar from '../Components/Navbars/MobileNavbar';
import { isLogged, getOnePost, getUser } from '../api/api';
import Media from '../Components/Posts/Media';
import Spinner from 'react-bootstrap/esm/Spinner';

function OnePostPage(props) {
    const [user, setUser] = useState(null);
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1);
    const [showingFullScreenMedia, setShowingFullScreenMedia] = useState(false);
    
    const deleteMe = () => {
        window.location.href="/";
    }

    const checkLogged = () => {
        isLogged()
        .then(response => {
            getUser(response.data.id)
            .then(response => {
                setUser(response.data);
            })
            .catch(() => {
                setError("Not logged in");
            })
        })
        .catch(() => {
            setError("Not logged in");
        }) 
    }

    const getPostInfo = () => {
        getOnePost(parseInt(props.id))
        .then(response => {
            setPost(response.data);
        })
        .catch(() => {
            setError("Sorry, we could not find this post.");
        })
    }

    useEffect(() => {
        checkLogged();
        getPostInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
 
    const updateNavbarsColors = () => {
        setUpdateColorsBetweenNavbars(updateColorsBetweenNavbars+1)
    }

    return(
        <div className="all-page" style={{'paddingBottom': '100px'}}>
            {window.innerWidth<500 &&
                <MobileNavbar updateColors={()=>{updateNavbarsColors();}} />
            }
            <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
            <div className="margin-top-smaller"></div>
            {post!==null && showingFullScreenMedia &&
                    <Media 
                        image={post.media}
                        video={post.video}
                        setShowing={setShowingFullScreenMedia} />                
            }
            {post!==null &&
                <OnePost user={user} 
                        logged={user!==null}
                        post={post}
                        updateHome={()=>{}}
                        updateParent={deleteMe}
                        commentsShow={true}
                        setShowingMedia={setShowingFullScreenMedia}
                        setImage={()=>{}}
                        setVideo={()=>{}}
                />
            }
            {error &&
                <div className='error-message center-content margin'>{error}</div>
            }
            {!post && !error &&
                <div style={{'marginBottom': '15px'}} className='center-content margin-top'>
                    <Spinner animation="border" role="status" variant='primary' />
                </div>
            }
        </div>
    )
}

export default OnePostPage;