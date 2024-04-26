import React from 'react';
import AccountContent from './AccountContent';

export default class AccountPage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
        currentAccPage: 'User Questions',
          
        }
      }

    changeAccpage = (page) =>{
        this.setState({currentAccPage: page})
    }

    render(){
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      let signupTime = new Date(this.props.user.signup_date_time)
      let signupOn = months[signupTime.getMonth()] + ' ' + signupTime.getDate() + ', ' + signupTime.getFullYear();

      return(
        <div>
        <div className = {this.props.user ? "" : "hideTags"}>
        <h1>Hello, {this.props.user.username}</h1>
        <h1>Member Since: {signupOn}</h1>
        <h1>Reputation: {this.props.user.reputation}</h1>
        <br/>

        <div>
        <div className='sideBar'>
        <ul className='userUl'>
        <li className='userLi'><button className='myButtonS' onClick = {() => this.changeAccpage("User Questions")}>View Questions By You</button> </li>
        <li className='userLi'><button className='myButtonS' onClick = {() => this.changeAccpage("User Answers")}>View Answers By You</button></li>
        <li className='userLi'><button className='myButtonS' onClick = {() => this.changeAccpage("User Tags")}>View Tags By You</button></li>
        </ul>
       
        </div>
  
        <div>
        <AccountContent setCurrentAnswer = {this.props.setCurrentAnswer} handleCurrentTag = {this.props.handleCurrentTag} setCurrentQuestion = {this.props.setCurrentQuestion} user = {this.props.user} accountPage = {this.state.currentAccPage} />
        </div>
        </div>

        </div>

        <div className = {this.props.user ? "hideTags" : ""}>
          <h1 className = {"guestWarning"}>No Account Found. You can Create one in the Welcome Page</h1>
        </div>


        </div>
      )
    }
  }
  