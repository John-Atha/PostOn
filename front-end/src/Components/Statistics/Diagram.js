import React, { useState, useEffect } from 'react';
import '../../Pages/Statistics/Statistics.css';
import CanvasJSReact from '../../canvasJS/canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Diagram(props) {

    const [options, setOptions] = useState(null);
    const [stats, setStats] = useState(props.stats);
    

    const compute = () => {
        if (props.type==="pie") {
            let tempData = [];
            let sum = 0;
            Object.entries(stats).forEach(el => {
                sum+=el[1];
            })
            //console.log(`sum= ${sum}`);
            for (const [key, value] of Object.entries(stats)) {
                tempData.push({
                    "y": Math.round((value/sum)*100*100)/100,
                    "label": key,
                })  
            }
            setOptions({
                animationEnabled: true,
                exportEnabled: true,
                backgroundColor: localStorage.getItem('theme')==='light' ? "#EBEAEA": 'rgba(0, 0, 0, 0.989)',
                title: {
                    text: "Daily",
                    fontColor: localStorage.getItem('theme')==='light' ? "black": 'white'
                },
                legend: {
                    labelFontColor: localStorage.getItem('theme')==='light' ? "black": 'white'
                },
                data:[{
                    type: "doughnut",
                    indexLabel: "{label}: {y}%",
                    startAngle: -90,
                    dataPoints: tempData,
                    indexLabelFontColor: localStorage.getItem('theme')==='light' ? "black": 'white'
                }]
            })
        }
        else if (props.type==="line") {
            let tempData = [];
            stats.forEach(el=> {
                let date = el["year-month"].split('-');
                tempData.push({
                    x: new Date(date[0], date[1], 1),
                    y: el[`${props.choice.charAt(0).toLowerCase()+props.choice.slice(1)}`],
                })
            })
            setOptions({
                exportEnabled: true,
                animationEnabled: true,
                animationDuration: 2000,
                backgroundColor: localStorage.getItem('theme')==='light' ? "#EBEAEA": 'rgba(0, 0, 0, 0.989)',
                title: {
                    text: "Monthly",
                    fontColor: localStorage.getItem('theme')==='light' ? "black": 'white'
                },
                axisX: {
                    labelFontColor: localStorage.getItem('theme')==='light' ? "black": 'white'
                },
                axisY: {
                    labelFontColor: localStorage.getItem('theme')==='light' ? "black": 'white'
                },
                data:[{
                    type: "area",
                    dataPoints: tempData,
                    fontColor: localStorage.getItem('theme')==='light' ? "black": 'white'
                }]
            })
        }
    }

    useEffect(() => {
        setStats(props.stats);
    }, [props.stats])

    useEffect(() => {
        compute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stats])

    if (stats) {
        return(
            <div className="diagram-container flex-item-big margin-top-small">
                <CanvasJSChart options={options} />
            </div>
        )  
    }
}

export default Diagram;