import React from 'react';
import cookie from 'react-cookies';
import '../styles/Login.css';
import Navigation from './Navigation';
import { ip } from "../network";
const axios = require('axios');

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '', response: '', authenticated: false };
    this.handleClick = this.handleClick.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }

  componentDidMount() {
    this.props.autoLogin();
    this.props.history.push('/');
  }

  handleClick() {
    axios.post("http://" + ip + '/othscmsbackend/login.php',
      {
        username: this.state.username,
        password: this.state.password,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      }
    )
      .then(result => {
        console.log(result);
        cookie.save('auth-token', result.data.auth_key);
        this.props.login();
        result.data.role === "COMPETITOR" && this.props.history.push('/home');
        result.data.role === "JUDGE" && this.props.history.push('/leaderboard');
      })
      .catch(error => console.log(error));
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      this.handleClick()
    }
  }

  render() {
    return (
      <div class="login-styling">
        <Navigation />
        <div class="blurred-box">
          <div class="user-login-box">
            <div>
              <h1>Login</h1>
              <br />
              <input class="username" placeholder="Username" type='text' value={this.state.username} onChange={event => this.setState({ username: event.target.value })} />
              <br />
              <input class="password" placeholder="Password" type='password' value={this.state.password} onChange={event => this.setState({ password: event.target.value })} onKeyPress={event => this.enterPressed(event)} />
              <br />
              <button onClick={this.handleClick}>Sign In -&gt;</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
