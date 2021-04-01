import React from "react";
import "./MyNavbar.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'

import {isLogged, getOneUser, getNotifications, readAllNotifications, markAsRead} from './api'
import notif_icon from './images/notif.png';
import stats_icon from './images/stats.png';

import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';


class MyNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            username: null,
            logged: false,
            error: null,
            notifList: [],
            start: 1,
            end: 5,
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
    }

    markOneAsRead = (notif) => {
        let category = "";
        switch(this.categorize(notif)) {
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
            default:
                console.log("marking the like on the post as read")
                category="likes"   
        }
        markAsRead(notif.id, category)
        .then(response=>{
            console.log(response);
            this.createNotification("success", "OK", "Notification marked as read");
        })
        .catch(err => {
            console.log(err);
            this.createNotification("danger", "Sorry", "Could not mark notification as read");
        })
    }

    createNotification = (type, title="aaa", message="aaa") => {
    console.log("creating notification");
    console.log(type);
    store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 3000,
            onScreen: true
        }
        });
    }
    markAllRead = () => {
        console.log(this.state.userId)
        this.createNotification('warning', 'Hello,', 'Wait for us to mark them all as read');
        readAllNotifications(this.state.userId)
        .then(response => {
            console.log(response);
            this.getNotif();
            this.createNotification('success', 'Hello,', 'Notifications marked succesffully');
        })
        .catch(err => {
            console.log(err);
            this.createNotification('danger', 'Sorry,', 'Could not mark all as read');
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
        str = str.replaceAll('\n', ' ')
        let init = str.split(' ')
        let counter = 0
        let final = []
        init.forEach(word => {
            final.push(word)
        })
        let i =0;
        let spaces=0;
        init.forEach(word => {
            counter+=word.length
            if (word.length>25) {
                let br=15
                let news = []
                let start=0
                let end=Math.round(br)
                for (let j=0; j<=counter/br+1; j++) {
                    news.push(word.substring(start, end))
                    start+=Math.round(br)
                    end+=Math.round(br)
                }
                final[final.indexOf(word)]=news.join('\n');
            }
            else if (counter>20) {
                final.splice(i+1+spaces, 0, '\n')
                spaces++;
                console.log(final)
                counter=0;
            }
            i++;
        })
        let s = final.join(' ')
        s=s.replace('\n ', '\n').replace(' ', '\n')
        return (s);
    }
    categorize = (notif) => {
        if (notif.post && notif.text) {
            return "comment";
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
        else if (this.categorize(notif)==="postlike") {
            link=`/posts/${notif.post.id}`;
        }
        return link;
    }
    textGen = (notif) => {
        let text = "notification";
        if (this.categorize(notif)==="comment") {
            text=`On ${this.dateShow(notif.date)},\n${notif.owner.username} commented on your post:\n${notif.text}`;
        }
        else if (this.categorize(notif)==="commentlike") {
            text=`On ${this.dateShow(notif.date)},\n${notif.owner.username} liked you comment:\n${notif.comment.text}`;
        }
        else if (this.categorize(notif)==="follow") {
            text=`On ${this.dateShow(notif.date)},\n${notif.following.username} asked to follow you.`;
        }
        else if (this.categorize(notif)==="postlike") {
            text=`On ${this.dateShow(notif.date)},\n${notif.owner.username} liked one of your posts`;
        }
        return this.format(text);
    }

    getNotif = () => {
        getNotifications(this.state.userId, this.state.start, this.state.end)
        .then(response => {
            console.log(response);
            this.setState({
                notifList: response.data,
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href="/";
    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id, 
            })
            this.getNotif();
            getOneUser(response.data.id)
            .then(response => {
                console.log(response);
                this.setState({
                    username: response.data.username,
                })
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: err,
            })
        })
    }

    render(){
        return(

            <Navbar bg="light" expand="sm">
                <Navbar.Brand href="/">Jwitter</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    {this.state.logged &&
                        <Nav.Link href={`/users/${this.state.userId}`}>{this.state.username}</Nav.Link>
                    }
                    {!this.state.logged &&
                        <Nav.Link href="/">Posts</Nav.Link>
                    }
                    {this.state.logged &&
                        <NavDropdown title="Posts" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">All Posts</NavDropdown.Item>
                            <NavDropdown.Item href="/following">Following Posts</NavDropdown.Item>
                        </NavDropdown>        
                    }   
                    {this.state.logged && 
                        <NavDropdown title={<img className="navbar-icon2" src={stats_icon} alt="statistics" />} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/stats/personal">My statistics</NavDropdown.Item>
                            <NavDropdown.Item href="/stats/general">General statistics</NavDropdown.Item>
                            <NavDropdown.Item href="/activity">Activity</NavDropdown.Item>
                        </NavDropdown>
                    }
                    {this.state.logged && 
                        <NavDropdown title={<img className="navbar-icon" src={notif_icon} alt="notifications" />} id="basic-nav-dropdown">
                            {this.state.notifList.length && 
                                <div className="center-content">
                                    <button className="my-button margin-left read-button" onClick={this.markAllRead}>Mark all as read</button>
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
                                                              key={index} 
                                                              href={this.linkGen(value)}
                                                              >
                                                    <div onClick={this.markOneAsRead(value)}>
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
                                    <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                                    <button disabled={this.state.notifList.length<5} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                                </div>
                            }

                            
                        </NavDropdown>
                }
                    {this.state.logged && 
                        <Nav.Link href="#" onClick={this.logout}>Logout</Nav.Link>
                    }
                    {!this.state.logged &&
                        <Nav.Link href="/login">Login</Nav.Link>
                    }
                    {!this.state.logged &&
                        <Nav.Link href="/register">Register</Nav.Link>
                    } 
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
    
}

export default MyNavbar;