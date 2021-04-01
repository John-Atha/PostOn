import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useParams } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

import Home from './Home';
import HomeFollowing from './HomeFollowing';
import Login from './Login';
import Register from './Register';
import Statistics from './Statistics';
import Activity from './Activity';
import Profile from './Profile';
import OnePostPage from './OnePostPage';

import ReactNotifications from "react-notifications-component";
import Searchbar from './Searchbar';

function FindProfile() {
  let {id} = useParams();
  return <Profile userId={id} />
}

function FindPost() {
  let {id} = useParams();
  return <OnePostPage id={id} />
}

ReactDOM.render(
  <React.StrictMode>
    <ReactNotifications />
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/following" exact>
          <HomeFollowing />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <Route path="/stats/general" exact>
          <Statistics case="general"/>
        </Route>
        <Route path="/stats/personal" exact>
          <Statistics case="personal" />
        </Route>
        <Route path="/activity" exact>
          <Activity />
        </Route>
        <Route path="/users/:id" exact>
          <FindProfile />
        </Route>
        <Route path="/posts/:id" exact>
          <FindPost />
        </Route>
        <Route path="/search" exact>
          <Searchbar />
        </Route>
      </Switch>   
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
