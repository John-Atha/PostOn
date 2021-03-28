import React from 'react';

import './StatisticsGen.css';
import MyNavbar from './MyNavbar';


class OneStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            logged: this.props.logged,
            choice: this.props.choice,
        }
        this.askInfo = this.askInfo.bind(this);
    }

    askInfo = () => {
        ;
    }
    
    componentDidMount() {
        ;
    }

    componentDidUpdate(prevProps) {
        if(prevProps.userId!==this.props.userId) {
            this.setState({
                userId: this.props.userId,
                logged: this.props.logged,
            })
        }
    }

    render() {
        return (
            <div className="margin-top-smaller">
                <h5>{this.state.choice}</h5>
            </div>
        )
    }
}


class StatisticsGen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
            choice:"Likes",
        }
        this.pick = this.pick.bind(this);
        this.updateColors = this.updateColors.bind(this);
    }

    updateColors = (pressed) => {
        pressed.style.backgroundColor="green"
        document.querySelectorAll('.stats-choice-button').forEach(el => {
            if (el!==pressed) {
                el.style.backgroundColor="grey";
            }
        })
    }

    pick = (event) => {
        this.setState({
            choice: event.target.innerHTML,
        })
        console.log(this.state.choice);
        this.updateColors(event.target);
    }

    componentDidMount() {
        this.updateColors(document.getElementById('stats-like-button'));
    }

    render() {
        return(
            <div className="all-page">
                <MyNavbar />
                <div className="main-page center-content">
                    <h4>Pick a statistics category</h4>
                    <div className="flex-layout center-content margin-top-smaller">
                        <button className="flex-item my-button pagi-button stats-choice-button" id="stats-like-button" onClick={this.pick}>Likes</button>
                        <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Comments</button>
                        <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Posts</button>
                        <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Follows</button>
                    </div>
                    {this.state.choice==="Likes" &&
                        <OneStats userId={this.state.userId} logged={this.state.logged} choice={this.state.choice} />
                    }
                    {this.state.choice==="Comments" &&
                        <OneStats userId={this.state.userId} logged={this.state.logged} choice={this.state.choice} />
                    }
                    {this.state.choice==="Posts" &&
                        <OneStats userId={this.state.userId} logged={this.state.logged} choice={this.state.choice} />
                    }
                    {this.state.choice==="Follows" &&
                        <OneStats userId={this.state.userId} logged={this.state.logged} choice={this.state.choice} />
                    }
                </div>
            </div>
        )
    }

}

export default StatisticsGen;