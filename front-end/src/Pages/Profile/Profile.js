import React, { useState, useEffect } from 'react';
import './Profile.css';
import OutsideClickHandler from 'react-outside-click-handler';
import ProfileCard from  '../../Components/Profile/ProfileCard';
import MyNavbar from '../../Components/Navbars/MyNavbar';
import MobileNavbar from '../../Components/Navbars/MobileNavbar';
import UserPosts from '../../Components/Posts/UserPosts';
import verified_img from '../../images/verified.png';
import { getUser, updateUser, updateUserPhoto,
         getFollowersCount, getFollowsCount, getFollows,
         getFollowers, getFollowsPagi, getFollowersPagi,
         followUser, unfollowUser, isLogged, UserDelete } from '../../api/api';
import Searchbar from '../../Components/Searchbar/Searchbar';
import { createNotification } from '../../createNotification';
import Button from 'react-bootstrap/esm/Button';

class OneUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            logged: this.props.logged,
            showCard: false,
        }
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
    }
    cardShow = () => {
        this.setState({
            mouseOutLink: false,
            mouseOutCard: false,
            showCard: true,
        })
    }
    cardHide = () => {
        this.setState({
            showCard: false,
        })
    }
    follow = () => {
        //console.log(`follower id: ${this.props.me}`)
        //console.log(`followed id: ${this.state.user.id}`)
        followUser(this.props.me, this.state.user.id)
        .then(response => {
            //console.log(response);
            this.props.updatePar();
        })
        .catch(err => {
            //console.log(err);
            this.props.updatePar();
        })
    }
    unfollow = () => {
        unfollowUser(this.props.followId)
        .then(response => {
            //console.log(response);
            this.props.updatePar();
        })
        .catch(err => {
            //console.log(err);
            this.props.updatePar();
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user!==this.props.user || prevProps.followed!==this.props.followed || prevProps.following!==this.props.following) {
            this.setState({
                user: this.props.user,
                logged: this.props.logged,
            })
        }
    }
    render() {
        return(
            <div className="one-like flex-layout center-content">
                <div className="like-owner flex-item-small flex-layout center-content"                        
                        onMouseEnter={this.cardShow}
                        onMouseLeave={this.cardHide}>
                    <div className="user-photo-container-small"
                                    onMouseEnter={this.cardShow}
                                    onMouseLeave={this.cardHide} >
                        <img className="user-photo" src={this.state.user.photo} alt="user profile" />
                    </div>
                    <div className="owner-name">
                            {this.state.user.username}
                            {this.state.user.verified===true &&
                                <img className="verified-icon" src={verified_img} alt="verified" />
                            }
                    </div>
                    {this.state.showCard &&
                        <ProfileCard id={this.state.user.id}
                                username={this.state.user.username}
                                moto={this.state.user.moto}
                                photo={this.state.user.photo}
                                verified={this.state.user.verified}
                                position={"bottom"} />
                    }
                </div>
                {this.state.logged &&
                    <div className="un-follow-button-container flex-item-small">
                    {!this.props.followed && !this.props.following && this.props.me!==this.props.user.id &&
                        <button className="my-button un-follow-button pale-blue" onClick={this.follow}>Follow</button>
                    }
                    {!this.props.followed && this.props.following && this.props.me!==this.props.user.id &&
                        <button className="my-button un-follow-button pale-blue" onClick={this.follow}>Follow Back</button>
                    }
                    {this.props.followed && this.props.me!==this.props.user.id &&
                        <button className="my-button un-follow-button" onClick={this.unfollow}>Unfollow</button>
                    }
                    </div>
                }
            </div>
        )
    }
}
class FollowBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            me: this.props.me,
            error: null,
            start: 1,
            end: 5,
            hisFollowsList: [],
            hisFollowersList: [],
            case: this.props.case,
            followsError: null,
            followersError: null,
        }
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askHisFollows = this.askHisFollows.bind(this);
        this.hide = this.hide.bind(this);
    }
    hide = (event) => {
        if (this.props.case==="follows") {
            this.props.hideFollows();
        }
        else{
            this.props.hideFollowers();
        }
        event.preventDefault();
    }
    moveOn = () => {
        setTimeout(() => this.askHisFollows(), 1000);
    }
    previousPage = () => {
        setTimeout(this.setState({
            start: this.state.start-5,
            end: this.state.end-5,
            likesList: [],
        }), 0)
        this.moveOn();
    }
    nextPage = () => {
        setTimeout(this.setState({
            start: this.state.start+5,
            end: this.state.end+5,
            likesList: [],
        }), 0)
        this.moveOn();
    }
    askHisFollows = () => {
        if (this.state.case==="follows") {
            setTimeout(()=>{
                //console.log(`I am asking follows for user ${this.props.userId}`)
                getFollowsPagi(this.props.userId, this.state.start, this.state.end)
                .then(response => {
                    //console.log(response);
                    this.setState({
                        hisFollowsList: response.data,
                        followsError: null,
                    })
                    //console.log("followsList: ");
                    //console.log(response.data);
                })
                .catch(err => {
                    //console.log(err);
                    //console.log("No more follows found for this user (as a follower).");
                    this.setState({
                        followsError: "No more follows found from this user.",
                    })
                });
            }, 100)
        }
        else if (this.state.case==="followers") {
            setTimeout(()=>{
                //console.log(`I am asking follows for user ${this.props.userId}`)
                getFollowersPagi(this.props.userId, this.state.start, this.state.end)
                .then(response => {
                    //console.log(response);
                    this.setState({
                        hisFollowersList: response.data,
                    })
                    //console.log("followersList: ");
                    //console.log(response.data);
                })
                .catch(err => {
                    //console.log(err);
                    //console.log("No more follows found for this user (as followed).");
                    this.setState({
                        followersError: "No more followers found for this user.",
                    })
                });
            }, 100)
        }
    }
    componentDidMount() {
        this.askHisFollows();
        //console.log(this.props.case)
    }
    render() {
        if (this.state.case==="follows" && this.state.hisFollowsList.length) {
                //console.log("results:")
                //console.log(this.state.hisFollowsList);
                return(
                    <OutsideClickHandler onOutsideClick={this.hide} >
                        <div className="follows-pop-up center-content">
                        {(this.state.followsError) && 
                            <div className="error-message">
                                {this.state.followsError}
                            </div>
                        }
                        {!this.state.followsError &&

                            this.state.hisFollowsList.map((value, index) => {
                                if(this.props.myFollowsList.includes(value.followed.id)) {
                                    //console.log("my follows list:")
                                    //console.log(this.props.myFollowsList)
                                    //console.log(this.props.myFollowsObjIdList);
                                    //console.log(value.followed.username);
                                    //console.log(this.props.myFollowsObjIdList[this.props.myFollowsList.indexOf(value.followed.id)])
                                    return (
                                        <OneUser key={index}
                                                 user={value.followed}
                                                 me={this.state.me}
                                                 logged={this.state.logged}
                                                 followId={this.props.myFollowsObjIdList[this.props.myFollowsList.indexOf(value.followed.id)]}
                                                 followed={true}
                                                 updatePar={this.props.updateMyFollows} />
                                    )
                                }
                                else if(!this.state.hisFollowsList.includes(value.followed.id) &&
                                         this.props.myFollowersList.includes(value.followed.id)) {
                                            return(
                                                <OneUser key={index}
                                                         user={value.followed}
                                                         me={this.state.me}
                                                         logged={this.state.logged}
                                                         followed={false}
                                                         following={true}
                                                         updatePar={this.props.updateMyFollows} />
                                           )
                                }
                                else {
                                    return(
                                        <OneUser key={index}
                                                 user={value.followed}
                                                 me={this.state.me}
                                                 logged={this.state.logged}
                                                 followed={false}
                                                 following={false}
                                                 updatePar={this.props.updateMyFollows} />
                                    )
                                }
                            })}

                            {this.state.hisFollowsList.length>0 &&
                                <div className="pagi-buttons-container flex-layout center-content">
                                    <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                                    <button disabled={this.state.followsError} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                                </div>
                            }            
                        </div>
                    </OutsideClickHandler>
                )
        }
        else if (this.state.case==="followers" && this.state.hisFollowersList.length) {
                //console.log("results:")
                //console.log(this.state.hisFollowersList);
                return(
                    <OutsideClickHandler onOutsideClick={this.hide}>
                        <div className="follows-pop-up center-content">
                            {(this.state.followsError) && 
                                <div className="error-message">
                                    {this.state.followsError}
                                </div>
                            }
                            {!this.state.followsError &&

                            this.state.hisFollowersList.map((value, index) => {
                                //console.log(value);
                                if(this.props.myFollowsList.includes(value.following.id)) {
                                    //console.log("my follows list:")
                                    //console.log(this.props.myFollowsList)
                                    //console.log(this.props.myFollowsObjIdList);
                                    //console.log(value.following.username);
                                    //console.log(this.props.myFollowsObjIdList[this.props.myFollowsList.indexOf(value.following.id)])

                                    return (
                                        <OneUser key={index}
                                                 user={value.following}
                                                 me={this.state.me}
                                                 logged={this.state.logged}
                                                 followId={this.props.myFollowsObjIdList[this.props.myFollowsList.indexOf(value.following.id)]}
                                                 followed={true}
                                                 updatePar={this.props.updateMyFollows} />
                                    )
    
                                }
                                else if(!this.props.myFollowsList.includes(value.following.id) &&
                                         this.props.myFollowersList.includes(value.following.id)) {
                                            return(
                                                <OneUser key={index}
                                                         user={value.following}
                                                         me={this.state.me}
                                                         logged={this.state.logged}
                                                         followed={false}
                                                         following={true}
                                                         updatePar={this.props.updateMyFollows} />
                                            )
                                }
                                else {
                                    return (
                                        <OneUser key={index}
                                                 user={value.following}
                                                 me={this.state.me}
                                                 logged={this.state.logged}
                                                 followed={false}
                                                 following={false}
                                                 updatePar={this.props.updateMyFollows} />
                                    )
                                }
                            })}
                            {this.state.hisFollowersList.length>0 &&
                                <div className="pagi-buttons-container flex-layout center-content">
                                    <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                                    <button disabled={this.state.followersError} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                                </div>
                            }            

                        </div>
                    </OutsideClickHandler>
                )
        }
        else {
            return(
                <div></div>
            )
        }
    }
}

function Profile(props) {

    const [userId, setUserId] = useState(parseInt(props.userId));
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
    const [postsList, setPostsList] = useState([]);
    const [followersShow, setFollowersShow] = useState(false);
    const [followsShow, setFollowsShow] = useState(false);
    const [myFollowsList, setMyFollowsList] = useState([]);
    const [myFollowsObjIdList, setMyFollowsObjIdList] = useState([]);
    const [myFollowersList, setMyFollowersList] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [edit, setEdit] = useState(false);
    const [updateFlag, setUpdateFlag] = useState(0);
    const [photoEdit, setPhotoEdit] = useState(false);
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
        UserDelete(userId)
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
            updateUser(userId, username, moto||"")
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
                updateUserPhoto(userId, bodyFormData)
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
        followUser(me, userId)
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
            if (el===userId) {
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
        getFollowersCount(userId)
        .then(response => {
            setFollowersNum(response.data.followers);
        })
        .catch(() => {
            ;
        })
    }

    const countFollows = () => {
        getFollowsCount(userId)
        .then(response => {
            setFollowsNum(response.data.follows);
        })
        .catch(() => {
            ;
        })
    }

    const askMyFollows = () => {
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
                setIsFollowed(tempFollowsList.includes(userId));
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
                setIsFollowing(tempFollowersList.includes(userId));
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
        getUser(userId)
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
            askMyFollows();
        })
        .catch(() => {
            ;
        })
    }

    useEffect(() => {
        checkLogged();
        getUserInfo();
    }, [])


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
                        <div className="delete-pop-up box-colors center-content" style={{'backgroundColor': 'red', 'top': '130px'}}>
                            <div className="message center-content" style={{'color': 'white', 'fontWeight': 'bolder'}}>
                                Are you sure you want delete your account?<br></br>
                                There is no way back!
                            </div>
                            <div className="modal-buttons-container center-content flex-layout margin-top-small">
                                <button className="my-button flex-item-small margin-top-small margin" onClick={hideModal}>No, I changed my mind</button>
                                <button className="my-button flex-item-small margin-top-small margin" onClick={deleteAccount}>Yes, delete anyway</button>                                        
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
                            {logged && !isFollowed && !isFollowing && me!==userId &&
                                <Button variant='primary' className="margin-top-small" style={{width: '90%'}} onClick={follow}>Follow</Button>
                            }
                            {logged && !isFollowed && isFollowing && me!==userId &&
                                <Button variant='primary' className="margin-top" style={{width: '90%'}} onClick={follow}>Follow Back</Button>
                            }
                            {logged && isFollowed && me!==userId &&
                                <Button variant='primary' className="margin-top-small" style={{width: '90%'}} onClick={unfollow}>Unfollow</Button>
                            }
                            {logged && me===userId &&
                                <Button variant='outline-warning' className="margin-top-small" style={{width: '90%'}} onClick={editProf}>Edit info</Button>               
                            }
                            {logged && me===userId &&
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
                                <button className="my-button save-moto-button" style={{margin: '1%'}} onClick={saveChanges}>Save</button>
                                <button className="my-button save-moto-button" style={{margin: '1%'}} onClick={discardChanges}>Cancel</button>
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
                    <UserPosts whose={userId} me={me} updateHome={updateMyFollows} updateMe={updateFlag} />
                </div>
                }
                {followsShow && !error &&
                    <FollowBox  userId={userId}
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
                    <FollowBox  userId={userId}
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