import React from 'react';
import './ProfileCard.css';
import user_icon from './images/user-icon.png'; 

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            username: this.props.username,
            moto: this.props.moto,
            photo: this.props.photo!==null ? this.props.photo : user_icon,
            position: this.props.position,
        }
        this.seeProfile = this.seeProfile.bind(this);
    }

    seeProfile = () => {
        window.location.href=`/users/${this.state.id}`;
    }

    render() {
        if (this.state.position==="top") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-top center-content">
                    <Card.Img variant="top" src={user_icon} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            25 followers<br></br>
                            32 following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
        else if (this.state.position==="bottom") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-bottom center-content">
                    <Card.Img variant="top" src={user_icon} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            25 followers<br></br>
                            32 following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
    

        }
        else if (this.state.position==="left") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-left center-content">
                    <Card.Img variant="top" src={user_icon} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            25 followers<br></br>
                            32 following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
        else if (this.state.position==="top-close") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-top-close center-content">
                    <Card.Img variant="top" src={user_icon} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            25 followers<br></br>
                            32 following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
        else {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-right center-content">
                    <Card.Img variant="top" src={user_icon} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            25 followers<br></br>
                            32 following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
    }
}

export default ProfileCard;