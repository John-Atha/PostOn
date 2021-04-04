import React from 'react';
import './Searchbar.css';
import {getUsers} from './api';

import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import OutsideClickHandler from 'react-outside-click-handler';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';


class Searchbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: "",
            all: [],
        }
        this.handleInput = this.handleInput.bind(this);
        this.matches = this.matches.bind(this);
        this.showSuggestions = this.showSuggestions.bind(this);
        this.hideSuggestions = this.hideSuggestions.bind(this);
    }
    createNotification = (type, title="aaa", message="aaa") => {
        console.log("creating notification");
        console.log(type);
        store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: true
            }
          });
    };
    handleInput = (event) => {
        this.suggNum=0;
        const name=event.target.name;
        const value=event.target.value;
        this.setState({
            [name]: value,
        })
    }
    matches = (s) => {
        return s.startsWith(this.state.input);
    }
    search = (event) => {
        event.preventDefault();
        let final=null;
        this.state.all.forEach((value) => {
            if (this.matches(value.username)) {
                if (!final) {
                    final=value;
                }
            }
        })
        if (final) {
            this.createNotification('success', 'Hello,', `We are taking you to ${final.username}'s profile`);
            console.log(final);
            setTimeout(()=>{
                window.location.href = `/users/${final.id}`;
            }, 1000)
        }
        else {
            this.createNotification('danger', 'Sorry,', `User ${this.state.input} not found`);
        }

    }
    componentDidMount() {
        getUsers()
        .then( response => {
            this.setState({
                all: response.data,
            })
        })
        .catch(err => {
            console.log(err);
        })
        this.hideSuggestions();
    }
    showSuggestions = () => {
        console.log("showing suggestions:");
        const box = document.getElementById('suggestions-box');
        box.style.display="block";
        const button = document.getElementById('search-button');
        button.disabled = false;
    }
    hideSuggestions = () => {
        console.log("hiding suggestions");
        const box = document.getElementById('suggestions-box');
        box.style.display="none";
        const button = document.getElementById('search-button');
        button.disabled = true;
    }

    render() {
        return(
                <Form inline onSubmit={this.search} className="form-container">
                    <OutsideClickHandler onOutsideClick={this.hideSuggestions} >
                    <div className="flex-layout">
                    <FormControl 
                        style={{width: '250px'}}
                        type="text" 
                        placeholder="Search for a user..." 
                        name="input" 
                        value={this.state.input} 
                        className="mr-sm-2" 
                        onChange={this.handleInput} 
                        onFocus={this.showSuggestions} />
                    <Button id="search-button" variant="outline-dark" onClick={this.search}>Search</Button>
                    </div>
                    <div id="suggestions-box">
                        {this.state.input.length!==0 && 
                            this.state.all.map((value, index) => {
                                if (this.matches(value.username)) {
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
                    </OutsideClickHandler>
                </Form>
        )
    }
}

export default Searchbar;