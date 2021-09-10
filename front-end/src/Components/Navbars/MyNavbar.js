import React from "react";
import "./MyNavbar.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { isLogged, getOneUser, getNotifications, readAllNotifications, markAsRead } from '../../api/api';
import notif_icon from '../../images/notif.png';
import notif_icon_white from '../../images/notif_white.png';
import stats_icon from '../../images/stats.png';
import stats_icon_white from '../../images/stats_white.png';
import logo from '../../images/logo192.png';
import logout from '../../images/logout.png';
import logout_white from '../../images/logout_white.png';
import DarkModeToggle from "react-dark-mode-toggle";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import explore from '../../images/follow_posts.png';
import explore_white from '../../images/follow_posts_white.png';
import { createNotification } from '../../createNotification';

class MyNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            username: null,
            photo: null,
            logged: false,
            error: null,
            notifList: [],
            start: 1,
            end: 5,
            theme: localStorage.getItem('theme') || 'light',
            unread: 0,
            showLogoutModal : false,
        }
        this.logout = this.logout.bind(this);
        this.getNotif = this.getNotif.bind(this);
        this.linkGen = this.linkGen.bind(this);
        this.textGen = this.textGen.bind(this);
        this.categorize = this.categorize.bind(this);
        this.dateShow = this.dateShow.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.format = this.format.bind(this);
        this.markAllRead = this.markAllRead.bind(this);
        this.markOneAsRead = this.markOneAsRead.bind(this);
        this.colorsUpdate = this.colorsUpdate.bind(this);
        this.goDark = this.goDark.bind(this);
        this.goLight = this.goLight.bind(this);
        this.reloadAll = this.reloadAll.bind(this);
        this.logoutModalShow = this.logoutModalShow.bind(this);
        this.updateColorsFromMobileNav = this.updateColorsFromMobileNav.bind(this);
    }
    updateColorsFromMobileNav = () => {
        if (localStorage.getItem('theme')==='light') this.goLight(); else this.goDark();
    }
    logoutModalShow = () => {
        this.setState({
            showLogoutModal: true,
        })
    }
    reloadAll = () => {
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        setTimeout(()=>{window.location.href='/';}, 20);
    }
    markOneAsRead = (notif) => {
        let category = "";
        switch(this.categorize(notif)) {
            case "comment":
                //console.log("marking the comment as read")
                category="comments"
                break;
            case "commentlike":
                //console.log("marking the like on comment as read")
                category="likecomments"
                break;
            case "follow":
                //console.log("marking the follow as read")
                category="follows"
                break;
            case "postMention":
                //console.log("marking the post mention as read")
                category="posts_mentions"
                break;
            case "commentMention":
                //console.log("marking the comment mention as read")
                category="comments_mentions"
                break;
            default:
                //console.log("marking the like on the post as read")
                category="likes"   
        }
        markAsRead(notif.id, category)
        .then(response=>{
            //console.log(response);
            createNotification("success", "OK", "Notification marked as read");
        })
        .catch(err => {
            //console.log(err);
            createNotification("danger", "Sorry", "Could not mark notification as read");
        })
        setTimeout(()=>{
            window.location.href=this.linkGen(notif)
        }, 1000)
    }
    markAllRead = () => {
        //console.log(this.state.userId)
        createNotification('warning', 'Hello,', 'Wait for us to mark them all as read');
        readAllNotifications(this.state.userId)
        .then(response => {
            //console.log(response);
            this.getNotif("mark");
            createNotification('success', 'Hello,', 'Notifications marked succesffully');
        })
        .catch(err => {
            //console.log(err);
            createNotification('danger', 'Sorry,', 'Could not mark all as read');
        })
    }
    moveOn = () => {
        setTimeout(() => this.getNotif(), 1000);
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
    dateShow = (date) => {
        let datetime = date.replace('T', ' ').replace('Z', '').split(' ')
        let day = datetime[0]
        let time = datetime[1].substring(0, 8)
        return `${day} ${time}`
    }
    format = (str) => {
        if (str.length>15) {
            return str.slice(0, 15)+"..."
        }
        else {
            return str;
        }
    }
    categorize = (notif) => {
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
        else {
            return "postlike";
        }
    }
    linkGen = (notif) => {
        let link="/users/2";
        if (this.categorize(notif)==="comment") {
            link=`/posts/${notif.post.id}`;
        }
        else if (this.categorize(notif)==="commentlike") {
            link=`/posts/${notif.comment.post.id}`;
        }
        else if (this.categorize(notif)==="follow") {
            link=`/users/${notif.following.id}`;
        }
        else if (this.categorize(notif)==="postMention") {
            link=`/posts/${notif.post.id}`;
        }
        else if (this.categorize(notif)==="commentMention") {
            link=`/posts/${notif.comment.post.id}`;
        }
        else if (this.categorize(notif)==="postlike") {
            link=`/posts/${notif.post.id}`;
        }
        return link;
    }
    textGen = (notif) => {
        let text = "notification";
        const reg = /[(][1-9]*[)]/;
        if (this.categorize(notif)==="comment") {
            text=`On ${this.dateShow(notif.date)},\n${notif.owner.username} commented on your post:\n${this.format(notif.text).replaceAll('@[', '').replaceAll(']', '').replace(reg, ' ')}`;
        }
        else if (this.categorize(notif)==="commentlike") {
            text=`On ${this.dateShow(notif.date)},\n${notif.owner.username} liked your comment:\n${this.format(notif.comment.text).replaceAll('@[', '').replaceAll(']', '').replace(reg, ' ')}`;
        }
        else if (this.categorize(notif)==="follow") {
            text=`On ${this.dateShow(notif.date)},\n${notif.following.username} asked to follow you.`;
        }
        else if (this.categorize(notif)==="postlike") {
            text=`On ${this.dateShow(notif.date)},\n${notif.owner.username} reacted on one of your posts`;
        }
        else if (this.categorize(notif)==="postMention") {
            text=`On ${this.dateShow(notif.date)},\n${notif.owner.username} mentioned you in a post`;
        }
        else if (this.categorize(notif)==="commentMention") {
            text=`On ${this.dateShow(notif.date)},\n${notif.owner.username} mentioned you in a comment:\n${this.format(notif.comment.text).replaceAll('@[', '').replaceAll(']', '').replace(reg, ' ')}`;
        }
        return text;
    }
    getNotif = (x="") => {
        getNotifications(this.state.userId, this.state.start, this.state.end)
        .then(response => {
            //console.log(response);
            this.setState({
                notifList: response.data,
            })
            let unread = 0;
            response.data.forEach(notif => {
                if (!notif.seen) {
                    unread++;
                }
            })
            /*if ((window.location.href.endsWith(".com/") || window.location.href.endsWith(".com") ||
                window.location.href.endsWith(".com/following") || window.location.href.endsWith(".com/following/")) &&
                this.state.start===1 && x!=="mark" && unread>0) {
                    createNotification('success', 'Hello,', `You have more than ${unread} new notifications`)
                }*/
            this.setState({
                unread: unread,
            })
        })
        .catch(err => {
            //console.log(err);
        })
    }
    logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href="/";
    }
    goDark = () => {
        localStorage.setItem('theme', 'dark');
        this.setState({
            theme: 'dark',
        })
        setTimeout(()=>{this.colorsUpdate();}, 200);
    }
    goLight = () => {
        localStorage.setItem('theme', 'light');
        this.setState({
            theme: 'light',
        })
        setTimeout(()=>{this.colorsUpdate();}, 200);
    }
    colorsUpdate = () => {
        const root = document.getElementById('root');
        if (this.state.theme==="light") {
            root.classList.remove('dark');
            root.classList.add('light');
        }
        else {
            root.classList.remove('light');
            root.classList.add('dark');
        }
    }
    componentDidMount() {
        this.colorsUpdate();
        isLogged()
        .then(response => {
            //console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id, 
            })
            this.getNotif();
            getOneUser(response.data.id)
            .then(response => {
                //console.log(response);
                this.setState({
                    username: response.data.username,
                    photo: response.data.photo,
                })
            })
        })
        .catch(err => {
            //console.log(err);
            this.setState({
                error: err,
            })
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.updateMyColors !== this.props.updateMyColors) {
            console.log('I am changing colors')
            this.updateColorsFromMobileNav();
        }
    }
    render(){
        if (window.innerWidth >= 500) {
            return(
                <Navbar bg="light" expand="sm" sticky="top">
                    <Navbar.Brand href="/">PostOn</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {this.state.logged &&
                                <Nav.Link href={`/users/${this.state.userId}`}>{this.state.username}</Nav.Link>
                            }
                            {!this.state.logged && 
                                <div className="error-message" style={{'marginTop': '8px', 'marginRight': '5px'}}>Not logged in</div>
                            }
                            {!this.state.logged &&
                                <Nav.Link href="/">Posts</Nav.Link>
                            }
                            {this.state.logged &&
                                <NavDropdown title="Posts" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/">All Posts</NavDropdown.Item>
                                    <NavDropdown.Item href="/following">Following's Posts</NavDropdown.Item>
                                </NavDropdown>        
                            }   
                            {this.state.logged && 
                                <NavDropdown title={<img className="navbar-icon2"
                                             src={this.state.theme==='light' ? stats_icon : stats_icon_white}
                                             alt="statistics" />
                                             }
                                             id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/stats/personal">My statistics</NavDropdown.Item>
                                    <NavDropdown.Item href="/stats/general">General statistics</NavDropdown.Item>
                                    <NavDropdown.Item href="/activity">Activity</NavDropdown.Item>
                                </NavDropdown>
                            }
                            {!this.state.logged &&
                                <Nav.Link href="/stats/general">General statistics</Nav.Link>
                            }
                        </Nav>
                        <Nav>
                        {this.state.logged && 
                                <NavDropdown 
                                    className="pull-left pull-up"
                                    style={{'height': this.state.unread>0 ? '10px' : 'auto'}}
                                    title={
                                        this.state.unread>0 ?
                                            <div style={{'height': '15px'}} className="flex-layout">
                                            <img className="navbar-icon2"
                                                 src={this.state.theme==='light' ? notif_icon : notif_icon_white}
                                                 alt="notifications" />
                                                <div className="notif-counter">{this.state.unread===5?`${this.state.unread}+` : this.state.unread}</div>
                                            </div>
                                        :
                                        <img className="navbar-icon2"
                                            src={this.state.theme==='light' ? notif_icon : notif_icon_white}
                                            alt="notifications" />
                                   }
                                    id="basic-nav-dropdown">
                                    {this.state.notifList.length!==0 && 
                                        <div className="center-content">
                                            <Button variant='outline-primary' onClick={this.markAllRead}>Mark all as read</Button>
                                        </div>
                                    }
                                    <div className="notif-container">
                                        {this.state.notifList.map((value, index) => {
                                            if (value.seen) {
                                                return(
                                                    <NavDropdown.Item className="notif with-whitespace seen" 
                                                                    key={index} 
                                                                    href={this.linkGen(value)}>
                                                            {this.textGen(value)}
                                                    </NavDropdown.Item>
                                                )
                                            }
                                            else {
                                                return(
                                                    <NavDropdown.Item className="notif with-whitespace not-seen" 
                                                                    key={index}>
                                                            <div onClick={()=>this.markOneAsRead(value)}>
                                                                {this.textGen(value)}
                                                            </div>
                                                    </NavDropdown.Item>
                                                )
                                            }
                                        })}
                                    </div>
                                    {!this.state.notifList.length && 
                                        <div style={{padding: '1% 4%'}} className="error-message">No notifications found</div>
                                    }
                                    {this.state.notifList.length>0 &&
                                        <div className="pagi-buttons-container flex-layout center-content">
                                            <Button variant='outline-primary' disabled={this.state.start===1}          className="flex-item-small margin" onClick={this.previousPage}>Previous</Button>
                                            <Button variant='outline-primary' disabled={this.state.notifList.length<5} className="flex-item-small margin" onClick={this.nextPage}>Next</Button>
                                        </div>
                                    }
                                </NavDropdown>
                            }
                            <div style={{'margin-top': '6px'}} >
                                <DarkModeToggle
                                    checked={this.state.theme==='dark'}
                                    onChange={()=>{if (this.state.theme==='light') this.goDark(); else this.goLight(); }}
                                    size={70}
                                />
                            </div>
                            {!this.state.logged &&
                                <Nav.Link href="/login">Login</Nav.Link>
                            }
                            {this.state.logged && 
                                <Nav.Link href="#"
                                          onClick={this.logoutModalShow}>
                                    <input type='image'
                                           style={{'marginTop': '5px'}}
                                           className="navbar-icon2"
                                           src={this.state.theme==='light' ? logout : logout_white}
                                           alt="logout" />
                                </Nav.Link>
                            }
                        </Nav>
                        {this.state.showLogoutModal &&
                            <Modal.Dialog style={{'top': '10px', 'position': 'absolute', 'right': '0'}}>
                                <Modal.Header>
                                <Modal.Title style={{'color': 'black'}}>Logout</Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{'color': 'black'}}>
                                <p>Are you sure you want to logout?</p>
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={()=>{this.setState({showLogoutModal: false,});}}>No, I changed my mind</Button>
                                <Button variant="primary" onClick={this.logout}>Log out</Button>
                                </Modal.Footer>
                            </Modal.Dialog>
                        }
                    </Navbar.Collapse>
                </Navbar>
            )
        }
        else {
            return(
                <Navbar bg="light" fixed="bottom" className="center-content" style={{'height': '50px'}}>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#" onClick={this.reloadAll} style={{'width': '25vw'}}><img className="navbar-photo" src={logo} alt="logo" /></Nav.Link>
                        <Nav.Link href='/explore' style={{'width': '25vw'}}>
                            <img className="navbar-photo2"
                                 src={this.state.theme==='light' ? explore : explore_white}
                                 alt='explore' />
                        </Nav.Link>
                        {this.state.logged && 
                            <NavDropdown drop='up' className="center-content" style={{'width': '25vw'}} title={
                                <img className="navbar-photo2"
                                     src={this.state.theme==='light'?stats_icon:stats_icon_white}
                                     alt="statistics" />}
                                id="basic-nav-dropdown">
                                <NavDropdown.Item href="/stats/personal">My statistics</NavDropdown.Item>
                                <NavDropdown.Item href="/stats/general">General statistics</NavDropdown.Item>
                                <NavDropdown.Item href="/activity">Activity</NavDropdown.Item>
                            </NavDropdown>
                        }
                        {!this.state.logged &&
                            <Nav.Link href="/stats/general" className="center-content" style={{'width': '25vw'}}>
                                <img className="navbar-photo2"
                                    src={this.state.theme==='light' ? stats_icon : stats_icon_white}
                                    alt="statistics" />
                            </Nav.Link>
                        }
                        {this.state.logged &&
                            <Nav.Link href={`/users/${this.state.userId}`} className="center-content" style={{'width': '25vw'}}><img className="navbar-photo" src={this.state.photo} alt="profile" /></Nav.Link>
                        }
                        {!this.state.logged && 
                            <div className="error-message center-content" style={{'marginTop': '12px', 'marginLeft': '-10px', 'fontSize': '15px','width': '25vw'}}>Not logged in</div>
                        }        
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            )
        }
    }
}

export default MyNavbar;