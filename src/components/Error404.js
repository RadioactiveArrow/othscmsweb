import React from 'react';
import "../styles/darkmode.css";
import Navigation from './Navigation';
import { Route } from 'react-router-dom';
import Home from './Home';



export default class Error404 extends React.Component 
{
    
  constructor(props) {
    super(props);
    this.state = {
      authenticated: this.props.authenticated,
    }
  }

  

  render(){
    if(this.state.authenticated) {
      return(
        <Route component={Home}></Route>
      )
    }
    return(
        <div>
            <Navigation/>   
            <div>
                <h1>PAGE IS STILL LOADING</h1>
                <h1>Please use the navigation bar to get back if that is loaded or wait a little longer.</h1>
                <h2>If error still persists, please contact judges.</h2>
            </div>
        </div>   
    );
  }
}