import React from "react";
import "./MyNavbar.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'

import {isLogged, getOneUser} from './api'

class MyNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            username: null,
            logged: false,
            error: null,
        }
        this.logout = this.logout.bind(this);
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

            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Jwitter</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    {this.state.logged &&
                        <Nav.Link href="#">{this.state.username}</Nav.Link>
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
                        <NavDropdown title="Statistics" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">My statistics</NavDropdown.Item>
                            <NavDropdown.Item href="#">General statistics</NavDropdown.Item>
                            <NavDropdown.Item href="#">Activity</NavDropdown.Item>
                        </NavDropdown>
                    }
                    {this.state.logged && 
                        <Nav.Link href="#">Notifications</Nav.Link>
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