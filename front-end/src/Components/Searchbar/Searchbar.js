import React, { useState, useEffect } from 'react';
import './Searchbar.css';
import { getUsers } from '../../api/api';
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import OutsideClickHandler from 'react-outside-click-handler';
import { createNotification } from '../../createNotification';

function Searchbar() {
    const [input, setInput] = useState('');
    const [all, setAll] = useState([]);
    const [showSuggestionsBox, setShowSuggestionsBox] = useState(true);
    const [searchDisabled, setSearchDisabled] = useState(false);

    const matchesInput = (s) => {
        if (input) {
            return  s.startsWith(input.charAt(0).toUpperCase()+input.slice(1)) ||
                    s.startsWith(input.charAt(0).toLowerCase()+input.slice(1));
        }
        else {
            return s.startsWith(input);
        }
    }

    const search = (event) => {
        event.preventDefault();
        let final=null;
        for (let value of all) {
            if (matchesInput(value.username)) {
                final=value;
                break;
            }
        }
        if (final) {
            createNotification('success', 'Hello,', `We are taking you to ${final.username}'s profile`);
            setTimeout(()=>{
                window.location.href = `/users/${final.id}`;
            }, 500)
        }
        else {
            createNotification('danger', 'Sorry,', `User ${input} not found`);
        }
    }

    useEffect(() => {
        getUsers()
        .then(response => {
            setAll(response.data);
        })
        .catch(() => {
            ;
        })
        hideSuggestions();        
    }, [])

    const showSuggestions = () => {
        setShowSuggestionsBox(true);
        setSearchDisabled(false);
    }

    const hideSuggestions = () => {
        setShowSuggestionsBox(false);
        setSearchDisabled(true);
    }

    return(
        <Form inline onSubmit={search} className="form-container">
            <OutsideClickHandler onOutsideClick={hideSuggestions} >
            <div className="flex-layout">
                <FormControl 
                    style={{width: '250px'}}
                    type="text" 
                    placeholder="Search for a user..." 
                    name="input" 
                    value={input} 
                    className="mr-sm-2"
                    onChange={(event)=>setInput(event.target.value)}
                    onFocus={showSuggestions} />
                <Button id="search-button" disabled={searchDisabled} variant="outline-dark" onClick={search}>Search</Button>
            </div>
            {showSuggestionsBox &&
                <div id="suggestions-box">
                    {input.length!==0 && 
                        all.map((value, index) => {
                            if (matchesInput(value.username)) {
                                return (
                                    <a key={index} className="one-suggestion flex-layout" href={`/users/${value.id}`}>
                                        <div className="user-photo-container-small">
                                                <img className="user-photo" src={value.photo} alt="user profile" />
                                        </div>
                                        <div className="owner-name">{value.username}</div>
                                    </a>
                                )
                            }
                            else {
                                return(
                                    <div key={index}></div>
                                )
                            }
                        })
                    }
                </div>          
            }
            </OutsideClickHandler>
        </Form>
    )
}

export default Searchbar;