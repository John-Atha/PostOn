import React from 'react';
import './Searchbar.css';
import {getUsers} from './api';

import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import OutsideClickHandler from 'react-outside-click-handler';


class Searchbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: "",
            all: [],
            suggestions: [],
        }
        this.handleInput = this.handleInput.bind(this);
        this.matches = this.matches.bind(this);
        this.showSuggestions = this.showSuggestions.bind(this);
        this.hideSuggestions = this.hideSuggestions.bind(this);

    }
    handleInput = (event) => {
        const name=event.target.name;
        const value=event.target.value;
        let tempSugg = [];
        this.state.all.forEach(el => {
            if (this.matches(el.username)) {
                tempSugg.push(el);
            }
        })
        this.setState({
            [name]: value,
            suggestions: tempSugg,
        })
        console.log(`${name}: ${value}`);
        console.log(tempSugg);
    }

    matches = (s) => {
        return s.startsWith(this.state.input);
    }
    search = () => {

    }

    componentDidMount() {
        getUsers()
        .then( response => {
            this.setState({
                all: response.data,
                suggestions: response.data,
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
    }

    hideSuggestions = () => {
        console.log("hiding suggestions");
        const box = document.getElementById('suggestions-box');
        box.style.display="none";
    }

    render() {
        return(
                <Form inline >
                    <OutsideClickHandler onOutsideClick={this.hideSuggestions}>
                    <div className="flex-item-expand">
                    <FormControl 
                        style={{width: '250px'}}
                        type="text" 
                        placeholder="Search" 
                        name="input" 
                        value={this.state.input} 
                        className="mr-sm-2" 
                        onChange={this.handleInput} 
                        onFocus={this.showSuggestions} />
                    <Button variant="outline-success" onClick={this.search}>Search</Button>
                    </div>
                    <div id="suggestions-box">
                        {this.state.suggestions.map((value, index) => {
                            return(
                                <a key={index} className="one-suggestion flex-layout" href={`users/${value.id}`}>
                                    {value.username}
                                </a>
                            )
                        })}
                    </div>
                    </OutsideClickHandler>

                </Form>
        )
    }
}

export default Searchbar;