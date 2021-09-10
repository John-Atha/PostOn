import React from 'react';
import './Explore.css'
import { getUsers, getFollows, getFollowers } from '../../api/api';
import OneUserLine from '../Profile/OneUserLine';

class ExploreScroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            error: null,
            start:1,
            end:20,
            usersList: [],
            followsList: [],
            followsObjIdList: [],
            followersList: [],
        }
        this.asked = [];
        this.first = true;
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askUsers = this.askUsers.bind(this);
        this.askFollows = this.askFollows.bind(this);
        this.updateFollows = this.updateFollows.bind(this);
        this.checkScroll = this.checkScroll.bind(this);
    }
    checkScroll = () => {
        //const container = document.getElementById('posts-cont');
        ////console.log("I am checking scroll");
        ////console.log(`${container.scrollHeight} - ${container.scrollTop} == ${container.clientHeight}`)
        console.log(`${window.scrollY>=0.1*document.body.offsetHeight}`);
        if (window.scrollY>=0.1*document.body.offsetHeight && !this.state.nomore) {
            ////console.log(`${container.scrollHeight} - ${container.scrollTop} == ${container.clientHeight}`);
                if (!this.asked.includes(this.state.start)) {
                    window.removeEventListener('scroll', this.checkScroll);
                    setTimeout(()=>{window.addEventListener('scroll', this.checkScroll);}, 2000)                    
                    this.asked.push(this.state.start);
                    setTimeout(()=>{this.nextPage();}, 0);
                }       
                console.log(`asked:`);
                console.log(this.asked);            
            //console.log("reached bottom")
        }
    }

    moveOn = () => {
        /*window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });*/
        setTimeout(() => this.askUsers(), 1000);
    }
    nextPage = () => {
        setTimeout(this.setState({
            start: this.state.start+20,
            end: this.state.end+20,
        }), 0)
        this.moveOn();
    }
    askFollows = () => {
        setTimeout(()=>{
            if (this.props.userId) {
                getFollows(this.props.userId)
                .then(response => {
                    //console.log(response);
                    let tempFollowsList = this.state.followsList;
                    let tempFollowsObjIdList = this.state.followsObjIdList;
                    response.data.forEach(el=> {
                        if (!this.state.followsList.includes(el.followed.id)) {
                            tempFollowsList.push(el.followed.id);
                            tempFollowsObjIdList.push(el.id);
                        }
                    })
                    this.setState({
                        followsList: this.state.followsList.concat(tempFollowsList),
                        followsObjIdList: this.state.followsObjIdList.concat(tempFollowsObjIdList),
                    })
                    //console.log("followsList: ");
                    //console.log(tempFollowsList);
                })
                .catch(err => {
                    //console.log(err);
                    //console.log("No more follows found for this user (as a follower).");
                });
                getFollowers(this.props.userId)
                .then(response => {
                    //console.log(response);
                    let tempFollowersList = this.state.followersList;
                    response.data.forEach(el=> {
                        if (!this.state.followersList.includes(el.following.id)) {
                            tempFollowersList.push(el.following.id);
                        }
                    })
                    this.setState({
                        followersList: tempFollowersList,
                    })
                    //console.log("followersList: ");
                    //console.log(tempFollowersList);
                })
                .catch(err => {
                    //console.log(err);
                    //console.log("No more follows found for this user (as a follower).");
                });
            }
        }, 100)
    }
    askUsers = () => {
        console.log(`I am asking users with start: ${this.state.start} and end: ${this.state.end}`);
        getUsers(this.state.start, this.state.end)
        .then(response => {
            console.log(response);
            this.setState({
                usersList: this.state.usersList.concat(response.data),
            })
            if(this.first) {
                this.askFollows();
                this.first = false;
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "No more users found",
            })
        })        
    }
    updateFollows = () => {
        this.setState({
            followsList: [],
            followsObjIdList: [],
            followersList: [],
        })
        this.props.updateMyPar();
        setTimeout(()=>{this.askFollows()}, 0);
    }
    componentDidMount() {
        window.addEventListener('scroll', this.checkScroll);
        this.askUsers();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.userId !==this.props.userId) {
            //console.log(`Updated to user ${this.props.userId}`);
            this.setState({
                start: 1,
                end: 20,
                usersList: [],
            })
            this.askUsers();
            this.updateFollows();
        }
        if (prevProps.update1!==this.props.update1) {
            //console.log("UPDATED");
            this.updateFollows();
        }
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.checkScroll);
    }
    render() {
        return(
            <div className="explore-page center-content">
                <h5>Explore</h5>
                {
                    this.state.usersList.length!==0 && this.state.usersList.map((value, index) => {
                        //console.log(value);
                        if (value.id!==this.props.userId) {
                            if (this.state.followsList.includes(value.id)) {
                                return (
                                    <OneUserLine key={index}
                                             user={value}
                                             me={this.props.userId}
                                             logged={this.props.logged}
                                             followId={this.state.followsObjIdList[this.state.followsList.indexOf(value.id)]}
                                             followed={true}
                                             updatePar={this.updateFollows} />
                                )
                            }
                            else if(!this.state.followsList.includes(value.id) && this.state.followersList.includes(value.id)) {
                                return (
                                    <OneUserLine key={index}
                                            user={value}
                                            me={this.props.userId} 
                                            logged={this.props.logged} 
                                            followed={false} 
                                            following={true}
                                            updatePar={this.updateFollows} />
                                )    
                            }
                            else {
                                return (
                                    <OneUserLine key={index} 
                                            user={value} 
                                            me={this.props.userId} 
                                            logged={this.props.logged} 
                                            followed={false} 
                                            following={false}
                                            updatePar={this.updateFollows} />
                                )    
                            }
                        }
                        else {
                            return(
                                <div key={index}></div>
                            )
                        }
                        })
                }
                {!this.state.usersList.length!==0 &&
                    <div className="error-message margin-top center-text">{this.state.error}</div>
                }
            </div>
        )
    }
}

export default ExploreScroll;