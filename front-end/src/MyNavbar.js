import React from "react";
import "./MyNavbar.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'

import {isLogged, getOneUser, getNotifications} from './api'
import notif_icon from './images/notif.png';
import stats_icon from './images/stats.png';


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
    }

    dateShow = (date) => {
        let datetime = date.replace('T', ' ').replace('Z', '').split(' ')
        let day = datetime[0]
        let time = datetime[1].substring(0, 8)
        return `${day} ${time}`
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
            link=`/users/${notif.follower.id}`;
        }
        else if (this.categorize(notif)==="postlike") {
            link=`/posts/${notif.post.id}`;
        }
        return link;
    }
    textGen = (notif) => {
        let text = "notification";
        if (this.categorize(notif)==="comment") {
            text=`On ${this.dateShow(notif.date)}, ${notif.owner.username} commented on your post:\n${notif.text}`;
        }
        else if (this.categorize(notif)==="commentlike") {
            text=`On ${this.dateShow(notif.date)}, ${notif.owner.username} liked you comment:\n${notif.comment.text}`;
        }
        else if (this.categorize(notif)==="follow") {
            text=`On ${this.dateShow(notif.date)}, ${notif.follower.username} asked to follow you.`;
        }
        else if (this.categorize(notif)==="postlike") {
            text=`On ${this.dateShow(notif.date)}, ${notif.owner.username} liked one of your posts`;
        }
        return text;
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
                            {this.state.notifList.map((value, index) => {
                                if (value.seen) {
                                    return(
                                        <NavDropdown.Item className="with-whitespace seen" key={index} href={this.linkGen(value)}>{this.textGen(value)}</NavDropdown.Item>
                                    )
                                }
                                else {
                                    return(
                                        <NavDropdown.Item className="with-whitespace not-seen" key={index} href={this.linkGen(value)}>{this.textGen(value)}</NavDropdown.Item>
                                    )
                                }
                            })}
                            {!this.state.notifList.length && 
                                <div style={{padding: '1% 4%'}} className="error-message">No notifications found</div>
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