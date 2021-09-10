import React, { useState, useEffect } from 'react';
import './Profile.css';
import OutsideClickHandler from 'react-outside-click-handler';
import MyNavbar from '../../Components/Navbars/MyNavbar';
import MobileNavbar from '../../Components/Navbars/MobileNavbar';
import UserPosts from '../../Components/Posts/UserPosts';
import FollowBox from '../../Components/Profile/FollowBox';
import verified_img from '../../images/verified.png';
import { getUser, updateUser, updateUserPhoto,
         getFollowersCount, getFollowsCount, getFollows,
         getFollowers, followUser, unfollowUser,
         isLogged, UserDelete } from '../../api/api';
import Searchbar from '../../Components/Searchbar/Searchbar';
import { createNotification } from '../../createNotification';
import Button from 'react-bootstrap/esm/Button';

function Profile(props) {

    const [me, setMe] = useState(null);
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState(null);
    const [username_init, setUsername_init] = useState(null);
    const [verified, setVerified] = useState(false);
    const [moto, setMoto] = useState(null);
    const [moto_init, setMoto_init] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [followsNum, setFollowsNum] = useState(0);
    const [followersNum, setFollowersNum] = useState(0);
    const [followersShow, setFollowersShow] = useState(false);
    const [followsShow, setFollowsShow] = useState(false);
    const [myFollowsList, setMyFollowsList] = useState([]);
    const [myFollowsObjIdList, setMyFollowsObjIdList] = useState([]);
    const [myFollowersList, setMyFollowersList] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [edit, setEdit] = useState(false);
    const [updateFlag, setUpdateFlag] = useState(0);
    const [deleteAcc, setDeleteAcc] = useState(false);
    const [error, setError] = useState(null);
    const [username_error, setUsername_error] = useState(null);
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1);

    const validateUsername = (str) => {
        let allowed = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 
                       'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
                       'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                       'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', '.', '1', '2',
                       '3', '4', '5', '6', '7', '8', '9']
        if (!allowed.includes(str.charAt(str.length-1))) {
            return false;
        }
        return true;
    }
    
    const hideModal = () => {
        setDeleteAcc(false);
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href="/";
    }

    const deleteAccount = () => {
        UserDelete(props.userId)
        .then(() => {
            createNotification('success', 'Goodbye,', 'Thank you for choosing us.')
            setTimeout(()=> {logout()}, 2000)
        })
        .catch(() => {
            createNotification('success', 'Goodbye,', 'Thank you for choosing us.')
            setTimeout(()=> {logout()}, 2000)
        })
    }

    const saveChanges = () => {
        if (!username.length) {
            createNotification('danger', 'Sorry,', "You can't have an empty username");
        }
        else {
            updateUser(props.userId, username, moto||"")
            .then(() => {
                createNotification('success', 'Hello,', "Profile updated successfully");
                setUsername_init(username);
                setMoto_init(moto);
                setEdit(false);
                setUpdateFlag(updateFlag+1);
            })
            .catch(err => {
                createNotification('danger', 'Sorry,', "Username probably already exists");
                setUsername(username_init);
                setMoto(moto_init);
            })

            const input = document.getElementById('new_profile_photo');
            if (input.value) {
                const bodyFormData = new FormData();
                bodyFormData.append('image', input.files[0]);
                updateUserPhoto(props.userId, bodyFormData)
                .then(response=> {
                    setPhoto(response.data.photo);
                    setEdit(response.data.edit);
                    setUpdateFlag(response.data.updateFlag);
                    input.value = "";
                    createNotification('success', 'Hello,', "Profile photo updated successfully");
                })
                .catch(err => {
                    input.value = "";
                    createNotification('danger', 'Sorry,', "Could not update profile picture.");
                })
            }
        }
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
    }

    const discardChanges = () => {
        setUsername(username_init);
        setMoto(moto_init);
        setEdit(false);
        const input = document.getElementById('new_profile_photo');
        input.value="";
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        createNotification('warning', 'Hello,', 'Changes cancelled');
    }

    const handleUsername = (event) => {
        const value = event.target.value;
        if (!validateUsername(value) && value!=='') {
            setUsername_error("Username can contain only letters, '.' and '_'.");
        }
        else if (username.length>13 && value.length>13) {
            setUsername_error("Username should be less than 15 characters");
        }
        else {
            setUsername(event.target.value);
            setUsername_error(null);
        } 
    }

    const editProf = () => {
        setEdit(true);
    }

    const follow = () => {
        followUser(me, props.userId)
        .then(() => {
            updateMyFollows();
        })
        .catch(() => {
            ;
        })
    }

    const unfollow = () => {
        let index = null;
        myFollowsList.forEach(el => {
            if (el===props.userId) {
                index = myFollowsList.indexOf(el);
            }
        })
        let followId = myFollowsObjIdList[index];
        unfollowUser(followId)
        .then(() => {
            updateMyFollows();
        })
        .catch(() => {
            ;
        })
    }

    const countFollowers = () => {
        getFollowersCount(props.userId)
        .then(response => {
            setFollowersNum(response.data.followers);
        })
        .catch(() => {
            ;
        })
    }

    const countFollows = () => {
        getFollowsCount(props.userId)
        .then(response => {
            setFollowsNum(response.data.follows);
        })
        .catch(() => {
            ;
        })
    }

    const askMyFollows = () => {
        console.log('I am askMyFollows')
        setTimeout(()=>{
            
            getFollows(me)
            .then(response => {
                let tempFollowsList = myFollowsList;
                let tempFollowsObjIdList = myFollowsObjIdList;
                response.data.forEach(el=> {
                    if (!myFollowsList.includes(el.followed.id)) {
                        tempFollowsList.push(el.followed.id);
                        tempFollowsObjIdList.push(el.id);
                    }
                })
                setMyFollowsList(tempFollowsList);
                setMyFollowsObjIdList(tempFollowsObjIdList);
                setIsFollowed(tempFollowsList.includes(props.userId));
            })
            .catch(() => {
                ;
            })

            getFollowers(me)
            .then(response => {
                let tempFollowersList = myFollowersList;
                response.data.forEach(el=> {
                    if (!myFollowersList.includes(el.following.id)) {
                        tempFollowersList.push(el.following.id);
                    }
                })
                setMyFollowersList(tempFollowersList);
                setIsFollowing(tempFollowersList.includes(props.userId));
            })
            .catch(() => {
                ;
            });
        }, 100)
    }

    const updateMyFollows = () => {
        setMyFollowsList([]);
        setMyFollowsObjIdList([]);
        setMyFollowersList([]);
        setTimeout(()=>{
            askMyFollows();
            countFollows();
            countFollowers();
        }, 0);
    }

    const getUserInfo = () => {
        getUser(props.userId)
        .then(response => {
            setUsername(response.data.username);
            setUsername_init(response.data.username);
            setMoto(response.data.moto);
            setMoto_init(response.data.moto);
            setPhoto(response.data.photo);
            setVerified(response.data.verified);

            setTimeout(()=>{
                countFollowers();
                countFollows();
            }, 1000);
        })
        .catch(() => {
            setError("Sorry, we could not find this user's profile.");
        })
    }

    const checkLogged = () => {
        isLogged()
        .then(response => {
            setLogged(response.data.authenticated);
            setMe(response.data.id);
        })
        .catch(() => {
            ;
        })
    }

    useEffect(() => {
        checkLogged();
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        askMyFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [me])


    const hideFollowers = () => {
        setFollowersShow(false);
    }

    const hideFollows = () => {
        setFollowsShow(false);
    }


        return(
            <div className="all-page">
                { window.innerWidth<500 &&
                    <MobileNavbar updateColors={()=>{setUpdateColorsBetweenNavbars(updateColorsBetweenNavbars+1);}} />
                }
                <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
                <Searchbar />
                {!error &&
                    <div className="profile-main center-content flex-layout">
                        <h3 className="profile-username" style={{'marginTop': '9px'}}>
                            {username}
                        </h3>
                        {verified===true &&
                                <img className="verified-icon-bigger" style={{'marginTop': '4px'}} src={verified_img} alt="verified" />
                            }
                    </div>        
                }
                {deleteAcc && !error &&
                    <OutsideClickHandler onOutsideClick={hideModal}>
                        <div className="delete-pop-up box-colors center-content" style={{'backgroundColor': 'rgb(237, 72, 43)', 'top': '130px'}}>
                            <div className="message center-content" style={{'color': 'white', 'fontWeight': 'bolder'}}>
                                Are you sure you want delete your account?<br></br>
                                There is no way back!
                            </div>
                            <div className="modal-buttons-container center-content margin-top-small">
                                <Button variant='outline-dark' className="margin" onClick={hideModal}>No, I changed my mind</Button>
                                <Button variant='outline-light' className="margin" onClick={deleteAccount}>Yes, delete anyway</Button>                                        
                            </div>
                        </div>
                    </OutsideClickHandler>
                }
                {!error &&
                <div className="flex-layout profile-header-container" style={{position: 'relative'}}>
                        <div className="user-photo-profile-container">
                            <img className="user-photo" src={photo} alt="user profile" />
                        </div>
                        <div className="center-content" style={{'width': '150px', 'marginTop': '20px'}}>
                            <Button variant='outline-primary' style={{width: '80%'}} onClick={()=>setFollowersShow(true)}>
                                {followersNum} followers
                            </Button>
                            <Button variant='outline-primary' className="margin-top-small" style={{width: '80%'}} onClick={()=>setFollowsShow(true)}>
                                {followsNum} follows
                            </Button>
                            <div>
                            {logged && !isFollowed && !isFollowing && me!==props.userId &&
                                <Button variant='primary' className="margin-top-small" style={{width: '90%'}} onClick={follow}>Follow</Button>
                            }
                            {logged && !isFollowed && isFollowing && me!==props.userId &&
                                <Button variant='primary' className="margin-top" style={{width: '90%'}} onClick={follow}>Follow Back</Button>
                            }
                            {logged && isFollowed && me!==props.userId &&
                                <Button variant='primary' className="margin-top-small" style={{width: '90%'}} onClick={unfollow}>Unfollow</Button>
                            }
                            {logged && me===props.userId &&
                                <Button variant='outline-warning' className="margin-top-small" style={{width: '90%'}} onClick={editProf}>Edit info</Button>               
                            }
                            {logged && me===props.userId &&
                                <Button variant='danger' className="margin-top-small delete-account-button" style={{width: '90%', 'fontSize': '0.8rem'}} onClick={()=>setDeleteAcc(true)}>
                                    Delete account
                                </Button>               
                            }
                        </div>
                </div>
                {!edit && moto &&
                    <div className="profile-info with-whitespace">
                        <div>
                            {moto}
                        </div>
                    </div>
                }
                {edit &&
                    <div className="profile-info">
                        <div>
                            {username_error!==null &&
                                <div className="error-message">{username_error}</div>
                            }
                            <div>Username</div>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <input id="username" type="text" name="username" className="clean-style" style={{width: '50%'}} value={username} onChange={handleUsername} />
                            <div >Bio</div>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <textarea name="moto" className="clean-style" style={{width: '90%'}} value={moto} onChange={(event)=>setMoto(event.target.value)} />
                            <div>Profile picture</div>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <input id="new_profile_photo" type="file" accept="image/*" />
                            <div className="flex-layout margin-top-smaller">
                                <Button variant='success' className="margin" style={{margin: '1%'}} onClick={saveChanges}>Save</Button>
                                <Button variant='warning' className="margin" style={{margin: '1%'}} onClick={discardChanges}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                }
                </div>
                }
                {!error &&
                <div className="adjusted-width">
                    <hr className="no-margin"></hr>
                    <h4 className="center-text">Posts</h4>
                    <hr className="no-margin"></hr>
                    <UserPosts whose={props.userId} me={me} updateHome={updateMyFollows} updateMe={updateFlag} />
                </div>
                }
                {followsShow && !error &&
                    <FollowBox  userId={props.userId}
                                me={me}
                                logged={logged}
                                case="follows"
                                myFollowsList={myFollowsList}
                                myFollowersList={myFollowersList}
                                myFollowsObjIdList={myFollowsObjIdList}
                                hideFollows={hideFollows}
                                hideFollowers={hideFollowers}
                                updateMyFollows={updateMyFollows} />
                }
                {followersShow && !error &&
                    <FollowBox  userId={props.userId}
                                me={me}
                                logged={logged}
                                case="followers"
                                myFollowsList={myFollowsList}
                                myFollowersList={myFollowersList}
                                myFollowsObjIdList={myFollowsObjIdList}
                                hideFollows={hideFollows}
                                hideFollowers={hideFollowers}
                                updateMyFollows={updateMyFollows} />
                }
                {error!==null &&
                    <div className="center-content" style={{'marginTop': '160px'}}>
                        <div className="error-message">
                            {error}
                        </div>
                    </div>
                }
            </div>
        )
}

export default Profile;