import React from 'react';
import Navigation from './Navigation';
import cookie from 'react-cookies';
import {ip} from "../network";
import "../styles/darkmode.css";
import "../styles/tablestyles.css";
const axios = require('axios');



export default class JudgeClarify extends React.Component 
{
    
  constructor(props) 
  {
    super(props);
    this.state = {
        clarifications: [],
        user: "",
        newQuestion: "",
        clarID: undefined,
        message: "",
    }
    this.getQuestions = this.getQuestions.bind(this);
    this.setUser = this.setUser.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
    this.deleteClar = this.deleteClar.bind(this);
  }

  componentDidMount(){
      this.setUser();
      this.getQuestions();

  }

  deleteClar(id){
    axios.post("http://"+ip+'/othscmsbackend/delete_clarification.php',{
      id ,
  },
  {
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  })
  .then(result => {
    console.log(result);
    this.getQuestions();
    this.setState({message: ""});
  })
  .catch(error => console.log(error));
  }

  updateAnswer(){
    axios.post("http://"+ip+'/othscmsbackend/answer_clarification.php',{
        id: this.state.clarID,
        answer: this.state.answer,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    })
    .then(result => {
      console.log(result);
      this.getQuestions();
      this.setState({message: "Successfully answered question "+this.state.clarID, answer: ""});
    })
    .catch(error => console.log(error));
  }

  getQuestions(){
    axios.post("http://"+ip+'/othscmsbackend/get_clarifications.php',{},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    })
    .then(result => {
      !this.state.clarID && this.setState({clarID: result.data[0].id});
      this.setState({clarifications: result.data});
    })
    .catch(error => console.log(error));
  }


  setUser(){
    var token = cookie.load('auth-token');
    cookie.load('auth-token') &&
    axios.post("http://"+ip+'/othscmsbackend/confirm_login.php',
      {
        authtoken: token,
      })
      .then(result => {
        //console.log(result.data.team);
        this.setState({user: result.data.team})
      }).catch(error => console.log(error))
      //console.log("Authenticated: " +this.state.authenticated);
  }

  render()
  {
    return(
        <div>
            <Navigation/>   
            <div>
                <h1>Clarifications</h1>
                <hr/>
                
                <h2>Answer Questions</h2>

                <b>Question ID: </b>
                <select onChange  = {(e) => this.setState({clarID: e.target.value})}>
                  {
                    this.state.clarifications.length >= 1 && this.state.clarifications.map(clar => 
                      <option key = {clar.id} value = {clar.id}>{clar.id}</option>
                    )
                  }
                </select>

                <input type = "text" placeholder = "answer" value = {this.state.answer} onChange={event => this.setState({answer: event.target.value})}/>
                <input type = "submit" onClick = {() =>{this.updateAnswer()}}/>
                
                <h4>{this.state.message}</h4>

                <h2>Recently Asked</h2>
                <table class = "container">
                    <tr>
                        <th>Question ID</th>
                        <th>Team</th>
                        <th>Problem</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Delete</th>
                    </tr>
                    {
                        this.state.clarifications.length >=1 && this.state.clarifications.map(clarification => 
                            <tr>
                                <td>{clarification.id}</td>
                                <td>{clarification.team}</td>
                                <td>{clarification.problem}</td>
                                <td>{clarification.question}</td>
                                <td>{clarification.answer}</td>
                                <td><input type = "submit" value = "DELETE" onClick = {() => {this.deleteClar(clarification.id)}}/></td>
                            </tr>
                        )
                    }
                </table>
                
            </div>
        </div>   
    );
  }
}