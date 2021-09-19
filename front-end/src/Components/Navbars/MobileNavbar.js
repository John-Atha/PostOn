import React, { useState, useEffect } from "react";
import "./MyNavbar.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { isLogged, getNotifications, readAllNotifications, markAsRead } from '../../api/api';
import notif_icon from '../../images/notif.png';
import notif_icon_white from '../../images/notif_white.png';
import logout_img from '../../images/logout.png';
import logout_white from '../../images/logout_white.png';
import DarkModeToggle from "react-dark-mode-toggle";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { createNotification } from '../../createNotification';

function MobileNavbar(props) {
    const [userId, setUserId] = useState(null);
    const [logged, setLogged] = useState(false);
    const [notifList, setNotifList] = useState([]);
    const [start, setStart] = useState(1);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const goDark = () => {
        localStorage.setItem('theme', 'dark');
        setTheme('dark');
    }
    
    const goLight = () => {
        localStorage.setItem('theme', 'light');
        setTheme('light');
    }

    const colorsUpdate = () => {
        props.updateColors();
        const root = document.getElementById('root');
        if (theme==="light") {
            root.classList.remove('dark');
            root.classList.add('light');
        }
        else {
            root.classList.remove('light');
            root.classList.add('dark');
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href="/";
    }

    const markOneAsRead = (notif) => {
        let category = "";
        switch(categorize(notif)) {
            case "comment":
                console.log("marking the comment as read")
                category="comments"
                break;
            case "commentlike":
                console.log("marking the like on comment as read")
                category="likecomments"
                break;
            case "follow":
                console.log("marking the follow as read")
                category="follows"
                break;
            case "postMention":
                console.log("marking the post mention as read")
                category="posts_mentions"
                break;
            case "commentMention":
                console.log("marking the comment mention as read")
                category="comments_mentions"
                break;
            default:
                console.log("marking the like on the post as read")
                category="likes"   
        }
        markAsRead(notif.id, category)
        .then(() => {
            createNotification("success", "OK", "Notification marked as read");
        })
        .catch(() => {
            createNotification("danger", "Sorry", "Could not mark notification as read");
        })
        setTimeout(()=>{
            window.location.href=linkGen(notif)
        }, 1000)
    }
    
    const markAllRead = () => {
        createNotification('warning', 'Hello,', 'Wait for us to mark them all as read');
        readAllNotifications(userId)
        .then(() => {
            setNotifList([]);
            if (start===1) getNotif();
            else setStart(1);
            createNotification('success', 'Hello,', 'Notifications marked succesffully');
        })
        .catch(() => {
            createNotification('danger', 'Sorry,', 'Could not mark all as read');
        })
    }
    
    const dateShow = (date) => {
        let datetime = date.replace('T', ' ').replace('Z', '').split(' ')
        let day = datetime[0]
        let time = datetime[1].substring(0, 8)
        return `${day} ${time}`
    }

    const format = (str) => {
        if (str.length>15) {
            return str.slice(0, 15)+"..."
        }
        return str;
    }

    const categorize = (notif) => {
        if (notif.post && notif.text) {
            return "comment";
        }
        else if (notif.mentioned && notif.comment) {
            return "commentMention";
        }
        else if (notif.mentioned && notif.post) {
            return "postMention";
        }
        else if (notif.comment) {
            return "commentlike";
        }
        else if (notif.following) {
            return "follow";
        }
        return "postlike";
    }

    const linkGen = (notif) => {
        let link="/users/2";
        if (categorize(notif)==="comment") {
            link=`/posts/${notif.post.id}`;
        }
        else if (categorize(notif)==="commentlike") {
            link=`/posts/${notif.comment.post.id}`;
        }
        else if (categorize(notif)==="follow") {
            link=`/users/${notif.following.id}`;
        }
        else if (categorize(notif)==="postMention") {
            link=`/posts/${notif.post.id}`;
        }
        else if (categorize(notif)==="commentMention") {
            link=`/posts/${notif.comment.post.id}`;
        }
        else if (categorize(notif)==="postlike") {
            link=`/posts/${notif.post.id}`;
        }
        return link;
    }

    const textGen = (notif) => {
        let text = "notification";
        const reg = /[(][1-9]*[)]/;
        if (categorize(notif)==="comment") {
            text=`On ${dateShow(notif.date)},\n${notif.owner.username} commented on your post:\n${format(notif.text).replaceAll('@[', '').replaceAll(']', '').replace(reg, ' ')}`;
        }
        else if (categorize(notif)==="commentlike") {
            text=`On ${dateShow(notif.date)},\n${notif.owner.username} liked your comment:\n${format(notif.comment.text).replaceAll('@[', '').replaceAll(']', '').replace(reg, ' ')}`;
        }
        else if (categorize(notif)==="follow") {
            text=`On ${dateShow(notif.date)},\n${notif.following.username} asked to follow you.`;
        }
        else if (categorize(notif)==="postlike") {
            text=`On ${dateShow(notif.date)},\n${notif.owner.username} reacted on one of your posts`;
        }
        else if (categorize(notif)==="postMention") {
            text=`On ${dateShow(notif.date)},\n${notif.owner.username} mentioned you in a post`;
        }
        else if (categorize(notif)==="commentMention") {
            text=`On ${dateShow(notif.date)},\n${notif.owner.username} mentioned you in a comment:\n${format(notif.comment.text).replaceAll('@[', '').replaceAll(']', '').replace(reg, ' ')}`;
        }
        return text;
    }

    const getNotif = (x="") => {
        console.log(`I am asking notifications from ${start}`)
        if (userId) {
            getNotifications(userId, start, start+5)
            .then(response => {
                console.log(response);
                setNotifList(response.data);
                let unread = 0;
                response.data.forEach(notif => {
                    if (!notif.seen) {
                        unread++;
                    }
                })
                setUnreadNotifications(unread);
            })
            .catch(() => {
                ;
            })
        }
    }

    useEffect(() => {
        colorsUpdate();
        isLogged()
        .then(response => {
            setLogged(response.data.authenticated);
            setUserId(response.data.id);
        })
        .catch(() => {
            ;
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getNotif();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    useEffect(() => {
        if (userId) {
            getNotif();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start])

    useEffect(() => {
        colorsUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme])


    if (window.innerWidth >= 500) {
        return(
            null        
        )
    }
    else {
        return(
            <Navbar sticky="top" style={{'height': '50px'}}>
            <Navbar.Brand href="/">PostOn</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" style={{'position': 'absolute', 'right': '10px'}} >
                    {logged && 
                            <NavDropdown
                            className="pull-left pull-up"
                            style={{'height': unreadNotifications>0 ? '10px' : 'auto'}}
                            title={
                                unreadNotifications>0 ?
                                    <div style={{'height': '15px'}} className="flex-layout">
                                        <img className="navbar-icon2" 
                                                src={theme==='light' ? notif_icon : notif_icon_white}
                                                alt="notifications" />
                                        <div className="notif-counter">{unreadNotifications===5?`${unreadNotifications}+` : unreadNotifications}</div>
                                    </div>
                                :
                                <img className="navbar-icon2"
                                    src={theme==='light' ? notif_icon : notif_icon_white}
                                    alt="notifications" />
                            }
                    
                            id="basic-nav-dropdown">
                            {notifList.length!==0 && 
                                <div className="center-content">
                                    <Button variant='outline-primary' onClick={markAllRead}>Mark all as read</Button>
                                </div>
                            }
                            <div className="notif-container">
                                {notifList.map((value, index) => {
                                    if (value.seen) {
                                        return(
                                            <NavDropdown.Item className="notif with-whitespace seen" 
                                                            key={index} 
                                                            href={linkGen(value)}>
                                                    {textGen(value)}
                                            </NavDropdown.Item>
                                        )
                                    }
                                    else {
                                        return(
                                            <NavDropdown.Item className="notif with-whitespace not-seen" 
                                                            key={index}>
                                                    <div onClick={()=>markOneAsRead(value)}>
                                                        {textGen(value)}
                                                    </div>
                                            </NavDropdown.Item>
                                        )
                                    }
                                })}
                            </div>
                            {!notifList.length && 
                                <div style={{padding: '1% 4%'}} className="error-message">No notifications found</div>
                            }
                            {notifList.length>0 &&
                                <div className="pagi-buttons-container flex-layout center-content">
                                    {start !== 1 &&
                                        <Button variant='outline-primary' className="flex-item-small margin" onClick={()=>setStart(start-5)}>Previous</Button>                                        
                                    }
                                    {notifList.length >= 5 &&
                                        <Button variant='outline-primary' className="flex-item-small margin" onClick={()=>setStart(start+5)}>Next</Button>                                        
                                    }
                                </div>
                            }
                        </NavDropdown>
                    }
                    <div style={{'marginTop': '6px'}} >
                        <DarkModeToggle
                            checked={theme==='dark'}
                            onChange={()=>{if (theme==='light') goDark(); else goLight(); }}
                            size={60}
                        />
                    </div>
                    {!logged &&
                        <Nav.Link href="/login">Login</Nav.Link>
                    }
                    {logged && 
                        <Nav.Link href="#"
                                    onClick={()=>setShowLogoutModal(true)}
                                    style={{'marginTop': '5px'}}>
                            <input type='image'
                                    className="navbar-icon2"
                                    src={theme==='light' ? logout_img : logout_white}
                                    alt="logout" />
                        </Nav.Link>
                    }
                </Nav>
                {showLogoutModal &&
                    <Modal.Dialog style={{'top': '45px', 'position': 'absolute', 'right': '0'}}>
                        <Modal.Header>
                        <Modal.Title style={{'color': 'black'}}>Logout</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{'color': 'black'}}>
                        <p>Are you sure you want to logout?</p>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={()=>setShowLogoutModal(false)}>No, I changed my mind</Button>
                        <Button variant="primary" onClick={logout}>Log out</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                }
            </Navbar.Collapse>
        </Navbar>
        )
    }
}

export default MobileNavbar;