import React from 'react';
import Navigation from './Navigation';
const axios = require('axios');



export default class AddTeams extends React.Component 
{
    
  constructor(props) 
  {
    super(props);
    this.state = {
        users: [],
        newUser: "",
        newPass: "",
    }
    this.getTeams = this.getTeams.bind(this);
    this.addTeam = this.addTeam.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
  }

  componentDidMount(){
      this.getTeams();
  }

  getTeams(){
    axios.post('http://localhost/othscmsbackend/get_teams.php',{})
    .then(result => {
      this.setState({users: result.data});
    })
    .catch(error => console.log(error));
  }

  addTeam(user, pass){
    this.setState({newUser: "", newPass: ""})
    console.log(user);
    axios.post('http://localhost/othscmsbackend/change_teams.php',{
        username: user,
        password: pass,
        append: true,
    })
    .then(result => {
      console.log(result);
      this.getTeams();
    })
    .catch(error => console.log(error));
  }

  deleteTeam(user){
    console.log(user);
    axios.post('http://localhost/othscmsbackend/change_teams.php',{
        username: user,
        password: "",
        append: false,
    })
    .then(result => {
      console.log(result);
      this.getTeams();
    })
    .catch(error => console.log(error));
  }


  render()
  {
    return(
        <div>
            <Navigation/>   
            <div>
                <h1>Add Teams</h1>
                <hr/>
                <h2>New Team</h2>
                <input type = "text"  value = {this.state.newUser} onChange={event => this.setState({newUser: event.target.value})}/>
                <input type = "text"  value = {this.state.newPass} onChange={event => this.setState({newPass: event.target.value})}/>
                <input type = 'submit' value = "Add Team" onClick = {() => this.addTeam(this.state.newUser, this.state.newPass)}/>

                <h2>Team List</h2>
                <ul>
                    {
                        this.state.users.length >=1 && this.state.users.map(user => 
                            <div>
                                <li>{user.username} {user.password}</li>
                                <input type = 'submit' value = "DELETE" onClick = {() => {this.deleteTeam(user.username)}}/>
                            </div>
                        )
                    }
                </ul>
                
            </div>
        </div>   
    );
  }
}