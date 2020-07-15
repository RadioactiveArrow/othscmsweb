import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Login from './components/Login';
import Leaderboard from './components/Leaderboard';
import Account from './components/Account';
import Home from './components/Home';
import Submission from './components/Submission';
import AddProbs from './components/AddProbs';
import AddUsers from './components/AddUsers';
import TimerPage from './components/TimerPage'
import ViewRuns from './components/ViewRuns';
import TeamClarify from './components/TeamClarify';
import JudgeClarify from './components/JudgeClarify';
import Grade from './components/Grade';
import Written from './components/Written';
import Error404 from './components/Error404';
import cookie from 'react-cookies';
import {ip} from "./network";
const axios = require('axios');


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {timeSeconds: 0, authenticated: false, role: undefined};
    this.autoLogin = this.autoLogin.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.autoLogin();
    setInterval(this.updateTime, 1000);
  }

  updateTime(){
    axios.post('http://'+ip+'/othscmsbackend/timer.php', {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    }).then(result=>{
      this.setState({timeSeconds:result.data});
    }).catch(error => console.log(error));

  }

  componentDidMount(){
    this.autoLogin();
  }

  autoLogin (){
    var token = cookie.load('auth-token');
    cookie.load('auth-token') &&
    axios.post("http://"+ip+'/othscmsbackend/confirm_login.php',
      {
        authtoken: token,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      })
      .then(result => {
        this.setState({role: result.data.role});
        this.setState({authenticated: result.data.authenticated})
      }).catch(error => console.log(error))
  }

  login(){
    this.setState({authenticated:true});
  }

  logout(){
    this.setState({authenticated:false});
  }

  render(){
    return(
      <Router>
        <Switch>
          {this.state.authenticated && this.state.role === "JUDGE" && <Route exact path='/judgeclarify' render = {(props) => <JudgeClarify {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {this.state.authenticated && this.state.role === "COMPETITOR" && <Route exact path='/teamclarify' render = {(props) => <TeamClarify {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {this.state.authenticated && this.state.role === "COMPETITOR" && <Route exact path='/viewruns' render = {(props) => <ViewRuns {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {this.state.authenticated && this.state.role === "JUDGE" && <Route exact path='/addusers' render = {(props) => <AddUsers {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {this.state.authenticated && this.state.role === "JUDGE" &&  <Route exact path='/addprobs' render = {(props) => <AddProbs {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {this.state.authenticated && this.state.role === "JUDGE" &&  <Route exact path='/timer' render =  {(props)=><TimerPage />} />}
          {this.state.authenticated && <Route exact path='/leaderboard' render = {(props) => <Leaderboard {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {this.state.authenticated && this.state.role === "COMPETITOR" &&  <Route exact path='/submit' render = {(props) => <Submission {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated} />} />}
          {this.state.authenticated && <Route exact path='/account' render = {(props) => <Account {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated} logout={this.logout}/>} />}
          {this.state.authenticated && this.state.role === "COMPETITOR" &&  <Route exact path='/home' render = {(props) => <Home {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {this.state.authenticated && this.state.role === "JUDGE" &&  <Route exact path='/grade' render = {(props) => <Grade {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {this.state.authenticated && this.state.role === "JUDGE" &&  <Route exact path='/written' render = {(props) => <Written {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated}/>} />}
          {!this.state.authenticated && <Route exact path='/' render = {(props) => <Login {...props} autoLogin = {this.autoLogin} authenticated = {this.state.authenticated} login={this.login}/>} />}
          {/* {this.state.authenticated && this.state.role === "COMPETITOR" && <Redirect to="/cheese"/>} */}
          <Route component={Error404} />
        </Switch>
      </Router>
    );
  }
}
