import React, {Component} from 'react';
import './App.css';
import {Route, BrowserRouter} from 'react-router-dom'
import Home from './containers/Home/Home'
import Profile from './containers/Profile/Profile'
import Auth from './containers/Auth/Auth'
import AOS from 'aos';
import 'aos/dist/aos.css';

class App extends Component{
  componentDidMount(){
    AOS.init({
      duration: 2000
    })
  }
  render(){
    return (
      <div>
        <link href="https://fonts.googleapis.com/css?family=Josefin+Sans&display=swap" rel="stylesheet"></link>
        <BrowserRouter>
          <Route path="/" exact component={Auth}/>
          <Route path="/home/:username" component={Home}/>
          <Route path="/profile/:username" component={Profile}/>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;