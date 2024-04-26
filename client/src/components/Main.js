import React from 'react';
import FakeStackOverflow from './fakestackoverflow';
import WelcomePage from './WelcomePage';
import SignUpPage from './SignUpPage';
import axios from 'axios';
export default class Main extends React.Component {

    constructor(props){
        super(props)
        this.state = {
          userStatus: "Welcome Page",
          user: ''
        }
      }

    changeUserStatus = (page) => {
      this.setState({userStatus: page})
    }
    logInUser = async (user) => {
      this.setState({user: user})

      this.changeUserStatus("Log in User")
    }

    logOutUser = () =>{
      console.log("logging out")
      axios.post('http://localhost:8000/logOut')
      .then(res => {
        console.log(res)
        this.changeUserStatus("Welcome Page")
      })
    }

    render(){ 
    
        switch(this.state.userStatus){
            
            case "Welcome Page":
                return <WelcomePage logInUser = {this.logInUser} changeUserStatus = {this.changeUserStatus}/>
              
            case "Log in User":
                return <FakeStackOverflow logOutUser = {this.logOutUser} user = {this.state.user} changeUserStatus = {this.changeUserStatus}/>

            case "Sign Up":
                return <SignUpPage changeUserStatus = {this.changeUserStatus}/>     

            case "Log In Guest":
                return <FakeStackOverflow logOutUser = {this.logOutUser} changeUserStatus = {this.changeUserStatus}/>


            default:  
            console.log("no page found")
            return null
          }
    }
}