import React from 'react';

import './Statistics.css';
import MyNavbar from './MyNavbar';
import CanvasJSReact from './canvasjs.react.js';

import {getMonthlyStatsGen, getDailyStatsGen, isLogged} from './api';
import Searchbar from './Searchbar';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Diagram extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            statsInit: this.props.stats,
            data: {},
            options: null,
            type: this.props.type,
            choice: this.props.choice,
        }
        this.compute = this.compute.bind(this);
    }

    compute = () => {
        if (this.state.type==="pie") {
            console.log("I am pie and i am computing")
            let tempData = [];
            let sum = 0;
            Object.entries(this.props.stats).forEach(el => {
                sum+=el[1];
            })
            console.log(`sum= ${sum}`);
            for (const [key, value] of Object.entries(this.props.stats)) {
                tempData.push({
                    "y": Math.round((value/sum)*100*100)/100,
                    "label": key,
                })  
            }
            this.setState({
                options: {
                    animationEnabled: true,
                    exportEnabled: true,
                    backgroundColor: "#EBEAEA",
                    title: {
                        text: "Daily",
                    },
                    data:[{
                        type: "doughnut",
                        indexLabel: "{label}: {y}%",
                        startAngle: -90,
                        dataPoints: tempData
                    }]
                }
            })  
        }
        else if (this.state.type==="line") {
            let tempData = [];
            this.props.stats.forEach(el=> {
                let date = el["year-month"].split('-');
                tempData.push({
                    x: new Date(date[0], date[1], 1),
                    y: el[`${this.state.choice.charAt(0).toLowerCase()+this.state.choice.slice(1)}`],
                })
            })
            this.setState({
                options: {
                    exportEnabled: true,
                    animationEnabled: true,
                    animationDuration: 2000,
                    backgroundColor: "#EBEAEA",
                    title: {
                        text: "Monthly",
                    },
                    data:[{
                        type: "area",
                        dataPoints: tempData,
                    }]
                }
            })
            setTimeout(()=>{console.log(tempData)}, 2000);

        }
    }

    componentDidMount() {
        console.log(this.props.stats)
        this.compute()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.stats!==this.props.stats) {
            this.setState({
                statsInit: this.props.stats,
            })
            this.compute();
        }
    }

    render() {
        if (this.state.data!=={}) {
            return(
                <div className="diagram-container flex-item-big margin-top-small">
                    <CanvasJSChart options={this.state.options} />
                </div>
            )  
        }
        else {
            return(
                <div className="error-message">Loading...</div>
            )
        }
    }

}

class OneStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            choice: this.props.choice,
            monthlyStats: [],
            dailyStats: [],
            monthlyErr: null,
            dailyErr: null,
        }
        this.askMonthly = this.askMonthly.bind(this);
        this.askDaily = this.askDaily.bind(this);

    }

    askMonthly = () => {
        getMonthlyStatsGen(this.state.choice.charAt(0).toLowerCase()+this.state.choice.slice(1), this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                monthlyStats: response.data,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                monthlyErr: err,
            })
        })
    }

    askDaily = () => {
        getDailyStatsGen(this.state.choice.charAt(0).toLowerCase()+this.state.choice.slice(1), this.state.userId)
        .then(response => {
            console.log(response);
            this.setState({
                dailyStats: response.data,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                dailyErr: err,
            })
        })    
    }

    componentDidMount() {
        this.askMonthly();
        this.askDaily();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId!==this.props.userId) {
            this.setState({
                userId: this.props.userId,
            })
        }
    }

    render() {
        return (
            <div className="margin-top-smaller flex-layout diagrams-cont">
                <Diagram type="pie" stats={this.state.dailyStats}    choice={this.state.choice} />
                <Diagram type="line" stats={this.state.monthlyStats} choice={this.state.choice} />
            </div>
        )
    }
}

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            choice:"Posts",
            case: this.props.case,
            logged: null,
            userId: null,
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
        this.updateColors(event.target);
        setTimeout(()=>{console.log(this.state.choice);}, 1000);
    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            })
            this.updateColors(document.getElementById('stats-posts-button'));
        })
        .catch(err => {
            console.log(err)
            this.setState({
                error: "Not logged in"
            })
        })
        if(this.props.case==="general") {
            this.updateColors(document.getElementById('stats-posts-button'));
        }
    }

    render() {
        if(this.state.case==="personal" && !this.state.logged) {
            return(
                <div className="all-page">
                    <MyNavbar />
                    <div className="main-page center-content">
                        <div className="error-message">
                            You have to create an account to have your persinal statistics page
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return(
                <div className="all-page">
                    <MyNavbar />
                    <Searchbar />
                    <div className="main-page center-content">
                        <h4 className="margin-top-smaller">Pick a statistics category</h4>
                        <div className="flex-layout center-content margin-top-smaller">
                            <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Likes</button>
                            <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Comments</button>
                            <button className="flex-item my-button pagi-button stats-choice-button" id="stats-posts-button" onClick={this.pick}>Posts</button>
                            <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Follows</button>
                        </div>
                        {this.state.choice==="Likes" &&
                            <OneStats choice={this.state.choice} case={this.state.case} userId={this.state.userId}/>
                        }
                        {this.state.choice==="Comments" &&
                            <OneStats choice={this.state.choice} case={this.state.case} userId={this.state.userId}/>
                        }
                        {this.state.choice==="Posts" &&
                            <OneStats choice={this.state.choice} case={this.state.case} userId={this.state.userId}/>
                        }
                        {this.state.choice==="Follows" &&
                            <OneStats choice={this.state.choice} case={this.state.case} userId={this.state.userId}/>
                        }
                    </div>
                </div>
            )
        }
    }

}

export default Statistics;