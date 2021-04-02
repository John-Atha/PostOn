import React from 'react';
import './ProfileCard.css';
import {getFollowsCount, getFollowersCount} from './api';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            username: this.props.username,
            moto: this.props.moto,
            photo: this.props.photo,
            position: this.props.position,
            followsNum: 0,
            followersNum: 0,
        }
        this.seeProfile = this.seeProfile.bind(this);
        this.countFollows = this.countFollows.bind(this);
        this.countFollowers = this.countFollowers.bind(this);
    }

    countFollows = () => {
        getFollowsCount(this.state.id)
        .then(response => {
            console.log(response);
            this.setState({
                followsNum: response.data.follows,
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    countFollowers = () => {
        getFollowersCount(this.state.id)
        .then(response => {
            console.log(response);
            this.setState({
                followersNum: response.data.followers,
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    seeProfile = () => {
        window.location.href=`/users/${this.state.id}`;
    }
    componentDidMount() {
        this.countFollows();
        this.countFollowers();
    }

    render() {
        if (this.state.position==="top") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-top center-content">
                    <Card.Img variant="top" src={this.state.photo} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            {this.state.followersNum} followers<br></br>
                            {this.state.followsNum} following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
        else if (this.state.position==="bottom") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-bottom center-content">
                    <Card.Img variant="top" src={this.state.photo} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            {this.state.followersNum} followers<br></br>
                            {this.state.followsNum} following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
    

        }
        else if (this.state.position==="left") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-left center-content">
                    <Card.Img variant="top" src={this.state.photo} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            {this.state.followersNum} followers<br></br>
                            {this.state.followsNum} following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
        else if (this.state.position==="top-close") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-top-close center-content">
                    <Card.Img variant="top" src={this.state.photo} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            {this.state.followersNum} followers<br></br>
                            {this.state.followsNum} following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
        else if (this.state.position==="bottom-more") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-bottom-more center-content">
                    <Card.Img variant="top" src={this.state.photo} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            {this.state.followersNum} followers<br></br>
                            {this.state.followsNum} following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
        else if (this.state.position==="right-more") {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-right-more center-content">
                    <Card.Img variant="top" src={this.state.photo} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            {this.state.followersNum} followers<br></br>
                            {this.state.followsNum} following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
        else {
            return(
                <Card style={{ width: '170px', height:'min-content', padding: '1%'}} className="profile-card pos-right center-content">
                    <Card.Img variant="top" src={this.state.photo} className="user-photo-container"/>
                    <Card.Body style={{padding:'0%'}}>
                        <Card.Title style={{marginBottom: '3%', paddingBottom: '0%'}}>{this.state.username}</Card.Title>
                        <Card.Text>
                            {this.setState.moto &&
                                <br></br>
                            }
                            {this.state.followersNum} followers<br></br>
                            {this.state.followsNum} following<br></br>
                        </Card.Text>
                        <Button variant="primary" style={{padding:'1%'}} onClick={this.seeProfile}>See profile</Button>
                    </Card.Body>
                </Card>
            )
        }
    }
}

export default ProfileCard;