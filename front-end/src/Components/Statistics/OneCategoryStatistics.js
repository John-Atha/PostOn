import React, { useState, useEffect } from 'react';
import '../../Pages/Statistics/Statistics.css';
import { getMonthlyStatsGen, getDailyStatsGen } from '../../api/api';
import Diagram from '../../Components/Statistics/Diagram';
import Spinner from 'react-bootstrap/esm/Spinner';

function OneCategoryStatistics(props) {
    const [userId, setUserId] = useState(props.userId);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [dailyStats, setDailyStats] = useState([]);
    const [choice, setChoice] = useState(props.choice);
    const [showingSpinner, setShowingSpinner] = useState(true);

    const askMonthly = () => {
        getMonthlyStatsGen(choice.charAt(0).toLowerCase()+choice.slice(1), props.case==="general" ? null : userId)
        .then(response => {
            setMonthlyStats(response.data);
            setShowingSpinner(false);
        })
        .catch(err => {
            setMonthlyStats([]);
            setShowingSpinner(false);
        })
    }

    const askDaily = () => {
        getDailyStatsGen(choice.charAt(0).toLowerCase()+choice.slice(1), props.case==="general" ? null : userId)
        .then(response => {
            setDailyStats(response.data);
            setShowingSpinner(false);
        })
        .catch(err => {
            setDailyStats([]);
            setShowingSpinner(false);
        })    
    }

    useEffect(() => {
        setUserId(props.userId);
        setChoice(props.choice);
        setShowingSpinner(true);
    }, [props.userId, props.choice])

    useEffect(() => {
        askMonthly();
        askDaily();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, choice])


    if (monthlyStats.length && !showingSpinner) {
        return(
            <div className="margin-top-smaller flex-layout diagrams-cont">
                <Diagram type="pie"  stats={dailyStats}   choice={choice} />
                <Diagram type="line" stats={monthlyStats} choice={choice} />
            </div>
        )
    }
    else if (!showingSpinner) {
        return(
            <div className="error-message margin-top-small">
                Sorry, we could not find any relative activity.<br></br>
                Try another category from the buttons above.
            </div>
        )
    }
    else {
        return(
            <div style={{'marginBottom': '15px'}} className='center-content margin-top'>
                <Spinner animation="border" role="status" variant='primary' />
            </div>
        )
    }
}

export default OneCategoryStatistics;