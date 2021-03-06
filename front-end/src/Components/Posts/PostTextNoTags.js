import React, { useState, useEffect } from "react";
import "./Posts.css";
import ReactPlayer from 'react-player';
import { isUrl, isYoutubeVideo } from '../../methods';

function PostTextNoTags(props) {

    const [text, setText] = useState(props.text);
    const [parts, setParts] = useState([]);
    const [iframes, setIframes] = useState([]);

    const splitParts = () => {
        let res = [];
        // split on spaces
        let s2 = text.split(' ');
        s2 = s2.filter((word, index) => {
            return word!=='' && word!==' '
        })
        // split and add on new lines
        for (let i=0; i<s2.length; i++) {
            if (s2[i]==='\n') {
                res.push('\n');
            }
            else if (s2[i].includes('\n')) {
                let subList = s2[i].split('\n');
                subList = subList.map(word => {
                    if (word==='') return '\n';
                    return word;
                })
                let index = 0;
                while (index<subList.length-1) {
                    if (subList[index]!=='\n' && subList[index+1]!=='\n') {
                        subList.splice(index+1, 0, '\n');
                    }
                    index++;
                }
                res = res.concat(subList);    
            }
            else {
                res.push(s2[i]);
            }
        }
        setParts(res);
        addIframes(res);
    }
    
    const addIframes = (copy) => {
        if (!props.isComment) {
            let iframesTemp = [];
            copy.forEach(el => {
                if (isYoutubeVideo(el)) {
                    iframesTemp.push(el);
                }
            })
            setIframes([]);
            setIframes(iframesTemp);  
        }
    }
    
    useEffect(() => {
        setText(props.text);
    }, [props.text])

    useEffect(() => {
        splitParts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text])

    if (!(parts.length===1 && parts[0]===" ") && parts.length) {
        return(
            <div style={{'width': '100%'}}>
                <div className="flex-layout with-whitespace">
                    {parts.map((value, index) => {
                        if (isUrl(value)) {
                            const val = (value.endsWith(' ') || value.endsWith('\n')) ? value.slice(0,value.length-1) : value;
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
                        else if (value==='\n') {
                            return(
                                <div key={index} className="break"></div>
                            )
                        }
                        else {
                            return(
                                <div style={{'marginRight': '4px'}} key={index}>{value}</div>
                            )
                        }
                    })}
                </div>
                {!props.isComment && 
                    <div className="player-wrapper margin-top-small center-content">
                        {iframes.map((value, index) => {
                            return(
                                <ReactPlayer url={value} key={index} className="react-player"/>
                            )
                        })}
                    </div>            
                }
            </div>
        )
    }
    return null;
}

export default PostTextNoTags;