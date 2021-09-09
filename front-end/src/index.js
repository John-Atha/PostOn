import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useParams } from "react-router-dom";
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './Pages/Home/Home';
import Login from './Pages/Login-Register/Login';
import Register from './Pages/Login-Register/Register';
import Statistics from './Pages/Statistics/Statistics';
import Activity from './Pages/Activity/Activity';
import Profile from './Pages/Profile/Profile';
import OnePostPage from './Pages/OnePostPage';
import ReactNotifications from "react-notifications-component";
import Searchbar from './Components/Searchbar/Searchbar';
import NotFound from './Pages/NotFound';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ExplorePage from './Pages/ExplorePage';

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
          <Home case='all' />
        </Route>
        <Route path="/following" exact>
          <Home case='following' />
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
        <Route path="/explore" exact>
          <ExplorePage />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>   
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);