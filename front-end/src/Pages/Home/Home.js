import React, { useState, useEffect } from 'react';
import './Home.css';
import MyNavbar from '../../Components/Navbars/MyNavbar';
import MobileNavbar from '../../Components/Navbars/MobileNavbar';
import { isLogged, getUser } from '../../api/api';
import Posts from "../../Components/Posts/Posts";
import Explore from '../../Components/Explore/Explore';
import Searchbar from '../../Components/Searchbar/Searchbar';
import Spinner from 'react-bootstrap/esm/Spinner';
import Media from '../../Components/Posts/Media';

function Home(props) {
    const [userId, setUserId] = useState(null);
    const [logged, setLogged] = useState(null);
    const [user, setUser] = useState(null);
    const [update1, setUpdate1] = useState(1);
    const [update2, setUpdate2] = useState(1);
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [showingFullScreenMedia, setShowingFullScreenMedia] = useState(false);

    useEffect(() => {
        isLogged()
        .then(response => {
            setLogged(response.data.authenticated);
            setUserId(response.data.id);
        })
        .catch(() => {
            setLogged(false);
        })
    }, [])

    useEffect(() => {
        getUser(userId)
        .then(response => {
            setUser(response.data);
        })
        .catch(() => {
            setUser(null);
        })
    }, [userId])

    const updateProfBox = () => {
        setUpdate2(update2+1);
    }
    
    const updateHome = () => {
        setUpdate1(update1+1);
    }

    const updateNavbarsColors = () => {
        setUpdateColorsBetweenNavbars(updateColorsBetweenNavbars+1)
    }


    if (props.case==='following' && logged===null) {
        return (
            <div className="all-page">
                { window.innerWidth<500 &&
                    <MobileNavbar updateColors={()=>{updateNavbarsColors();}} />
                }
                <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
                <div style={{'marginBottom': '15px'}} className='center-content margin-top'>
                        <Spinner animation="border" role="status" variant='primary' />
                </div>
            </div>
        )
    }
    else if (props.case==='following' && logged===false) {
        window.location.href = '/';
    }

    return (
        <div className="all-page">
            { window.innerWidth<500 &&
                <MobileNavbar updateColors={()=>{updateNavbarsColors();}} />
            }
            <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
            <Searchbar />
            <div className="main-home-container flex-layout">
                {showingFullScreenMedia &&
                    <Media 
                        image={image}
                        video={video}
                        setShowing={setShowingFullScreenMedia} />                
                }
                <Explore 
                    userId={userId}
                    logged={logged}
                    update1={update1}
                    updateMyPar={updateProfBox}
                />
                <Posts
                    case={props.case}
                    updateHome={updateHome}
                    setShowingMedia={setShowingFullScreenMedia}
                    setImage={setImage}
                    setVideo={setVideo}
                    user={user}
                />
            </div>
        </div>
    )
}

export default Home;