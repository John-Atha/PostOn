import React from 'react';

import './StatisticsGen.css';
import MyNavbar from './MyNavbar';
import CanvasJSReact from './canvasjs.react.js';

import {getMonthlyStatsGen, getDailyStatsGen} from './api';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PieDiagram extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statsInit: this.props.stats,
            data: {},
            diagramOptions1: null,
        }
        this.compute = this.compute.bind(this);
    }

    compute = () => {
        console.log("I am pie and i am computing")
        let tempData = [];
        for (const [key, value] of Object.entries(this.props.stats)) {
            tempData.push({
                "y": value,
                "label": key,
            })  
        }
        setTimeout(()=>{console.log(this.state.data)}, 1000);

        this.setState({
            diagramOptions1: {
                animationEnabled: true,
                exportEnabled: true,
                title: {
                    text: "Daily",
                },
                data:[{
                    type: "pie",
                    indexLabel: "{label}: {y}%",
                    startAngle: -90,
                    dataPoints: tempData
                }]
            }
        })
    }

    componentDidMount() {
        console.log(`I will call a Pie and a received data:`)
        console.log(this.props.stats)
        this.compute()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.stats!==this.props.stats) {
            console.log("I am pie and my stats were just updated")
            this.setState({
                statsInit: this.props.stats,
            })
            this.compute();
        }
    }

    render() {
        if (this.state.data!=={}) {
            return(
                <CanvasJSChart options={this.state.diagramOptions1} />
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
        getMonthlyStatsGen(this.state.choice.charAt(0).toLowerCase()+this.state.choice.slice(1))
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
        getDailyStatsGen(this.state.choice.charAt(0).toLowerCase()+this.state.choice.slice(1))
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

    render() {
        return (
            <div className="margin-top-smaller flex-layout">
                <PieDiagram stats={this.state.dailyStats} />
                <LineDiagram stats={this.state.monthlyStats} />
            </div>
        )
    }
}


class StatisticsGen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            choice:"Posts",
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
        this.updateColors(document.getElementById('stats-posts-button'));
    }

    render() {
        return(
            <div className="all-page">
                <MyNavbar />
                <div className="main-page center-content">
                    <h4>Pick a statistics category</h4>
                    <div className="flex-layout center-content margin-top-smaller">
                        <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Likes</button>
                        <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Comments</button>
                        <button className="flex-item my-button pagi-button stats-choice-button" id="stats-posts-button" onClick={this.pick}>Posts</button>
                        <button className="flex-item my-button pagi-button stats-choice-button" onClick={this.pick}>Follows</button>
                    </div>
                    {this.state.choice==="Likes" &&
                        <OneStats choice={this.state.choice} />
                    }
                    {this.state.choice==="Comments" &&
                        <OneStats choice={this.state.choice} />
                    }
                    {this.state.choice==="Posts" &&
                        <OneStats choice={this.state.choice} />
                    }
                    {this.state.choice==="Follows" &&
                        <OneStats choice={this.state.choice} />
                    }
                </div>
            </div>
        )
    }

}

export default StatisticsGen;