import React, { useState, useEffect} from "react";
import "./Posts.css";
import ProfileCard from '../Profile/ProfileCard';
import ReactPlayer from 'react-player';
import { isUrl, isYoutubeVideo } from '../../methods';

function PostText(props) {
    const [parts, setParts] = useState(props.parts);
    const [showCard, setShowCard] = useState([]);
    const [iframes, setIframes] = useState([]);

    const cardShow = (i) => {
        let temp = showCard.slice()
        temp[i] = true
        setShowCard(temp);
    }

    const cardHide = (i) => {
        let temp = showCard.slice()
        temp[i] = false
        setShowCard(temp);
    }

    const updateList = (current_parts) => {
        let additions = []
        let counter = 0
        let iframesTemp = [];
        let copy=current_parts.slice();

        for (let i=0; i<copy.length; i++) {
            if (current_parts[i].tag.id && copy[i].dump==='\n') {
                //copy[i].dump = copy[i].slice(0, -1);
                additions.push(i+counter+1);
                counter++;
            }
        }
        if (props.isComment) {
            copy.forEach(el => {
                //console.log(`checking ${el} from iframing`)
                if (isYoutubeVideo(el.dump)) {
                    iframesTemp.push(el.dump);
                }
            })
        }
        additions.forEach(index => {
            copy.splice(index, 0, {"tag": {}, "dump": "\n"});
        })
        setParts(copy);
        setIframes([]);
        setIframes(iframesTemp);
        /*console.log("NEW PARTS")
          console.log(copy);
          console.log("iframes found:")
          console.log(iframesTemp)*/
    }

    const updateShowingCards = () => {
        //console.log(`I am a text with tags and parts:`, parts);
        const tempShowCard = [];
        if (parts.length) {
            if (parts[parts.length-1].tag) {
                if (parts[parts.length-1].tag.index) {
                    for (let i=0; i<parts[parts.length-1].tag.index; i++) {
                        tempShowCard.push(false);
                    }
                    setShowCard(tempShowCard);
                }
            }
        }
    }

    useEffect(() => {
        setParts([])
        setShowCard([]);
        updateList(props.parts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.parts])

    useEffect(() => {
        updateShowingCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parts])



        //console.log(parts);
        if (parts.length) {
            //console.log(`I am a renderring post with parts:`)
            //console.log(parts)
            return (
                <div style={{'width': '100%'}}>
                    <div className="flex-layout with-whitespace">
                        {parts.map((value, index) => {
                            // part with tag only
                            if (value.tag.id && !value.dump) {
                                return(
                                    <div key={index} style={{'marginRight': '4px'}} className="owner-name tag"
                                        onMouseEnter={()=>cardShow(index)}
                                        onMouseLeave={()=>cardHide(index)}>
                                        {value.tag.username}
                                        {showCard[index] &&
                                            <ProfileCard
                                                user={value.tag}
                                                position={"top-close"}
                                            />
                                        }
                                    </div>
                                )
                            }
                            // part with both tag and simple text
                            else if (value.tag.id && value.dump){
                                return(
                                    <div key={index} className="flex-layout with-whitespace">
                                        <div className="owner-name tag" style={{'marginRight': '4px'}}
                                            onMouseEnter={()=>cardShow(index)}
                                            onMouseLeave={()=>cardHide(index)}>
                                            {value.tag.username}
                                            {showCard[index] &&
                                                <ProfileCard 
                                                    user={value.tag}
                                                    position={"top-close"}
                                                />
                                            }
                                        </div>
                                        { value.dump==='\n' &&
                                            <div className="break"></div>
                                        }
                                        { value.dump!=='\n' && value.dump!==' ' && isUrl(value.dump) &&
                                            <a rel='noopener noreferrer'
                                               target='_blank'
                                               href={value.dump.includes('//') ? value.dump : '//'+value.dump}
                                               key={index}>
                                                {value}
                                            </a>                                        
                                        }
                                        { value.dump!=='\n' && value.dump!==' ' && !isUrl(value.dump) &&
                                            <div>
                                                {value.dump}
                                            </div>
                                        }
                                    </div>
                                )
                            }
                            // part with simple text only
                            else {
                                if (value.dump==='\n') {
                                    return (
                                        <div key={index} className="break" />
                                    )
                                }
                                if (isUrl(value.dump)) {
                                    const val = (value.dump.endsWith(' ') || value.dump.endsWith('\n')) ? value.dump.slice(0,value.dump.length-1) : value.dump;
                                    return(
                                        <a key={index} 
                                           target="_blank" 
                                           rel="noreferrer noopener" 
                                           className="post-url with-whitespace" 
                                           style={{'marginRight': '4px'}}
                                           href={val.includes('//') ? val : `//${val}`}>
                                               {val}
                                        </a>
                                    )
                                }
                                else {
                                    return(
                                        <div key={index} style={{'marginRight': '4px'}}>
                                            {value.dump}
                                        </div>
                                    )    
                                }
                            }
                        })}
                    </div>
                    {!props.isComment &&
                        <div className="player-wrapper margin-top-small center-content">
                            {iframes.map((value, index) => {
                                return(
                                    <ReactPlayer style={{'marginBottom': '3px'}} url={value} key={index} className="react-player"/>
                                )
                            })}
                        </div>            
                    }
                </div>
            )
        }
        else {
            return(
                null
            )
        }
}

export default PostText;