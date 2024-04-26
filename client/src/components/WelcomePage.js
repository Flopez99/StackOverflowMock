import React from 'react';
import axios from 'axios';

export default class WelcomePage extends React.Component {    

    constructor(props){
        super(props)
        this.state = {
            email: '',
            password:'',
            loginStatus:'',
            username: '',
            errors: []
        }
        axios.defaults.withCredentials = true;

    }
    
    componentDidMount(){
        axios.get('http://localhost:8000/loggedIn')
        .then((res) => {
            console.log(res)
            if(res.data.loggedIn === true){
                this.props.logInUser(res.data.user[0])
            }
        }
        )
    }
  
    handleEmail = (e) => {
        this.setState({email: e.target.value})
    }
    handlePassword = (e) => {
        this.setState({password: e.target.value})
    }

    login = async() => {
        await axios.post('http://localhost:8000/login', {email: this.state.email, password: this.state.password})
        .then(res => {
            console.log(res.data)
            if(res.data.message){
                let error = []
                error.push(res.data.message)
                this.setState({errors: error})
            }else{
                this.setState({loginStatus: res.data[0]})
                this.props.logInUser(res.data.user)
            }
        })
    }

    render() {
      return (
        <div className='welcomeDiv'>
            <h1 className='welcomeTitle'>Welcome, To FakeStackOverflow</h1>
            <div className= 'parentDiv'> 
            <div className='loginDiv'>
                <h1>Login</h1>
                <div>
                    <input onChange = {this.handleEmail} value = {this.state.email} type= "text" name='' placeholder='Enter Email'></input>
                    <input onChange = {this.handlePassword} value = {this.state.password} type= "password" name='' placeholder='Enter Password'></input>
                </div>
                <div>
                    <button onClick = {this.login} className = 'authButton'>Log In</button>
                    <button onClick = {() => this.props.changeUserStatus("Sign Up")} className = 'authButton'>Sign Up</button>
                    <br/>
                    <p>or</p>
                    <button onClick = {() => this.props.changeUserStatus("Log In Guest")}>Continue As Guest</button>  
                </div>
            </div>
            <div className = "errorDivLogin">
                <ul>
                    {this.state.errors.map(error => <li>{error}</li>)}
                </ul>   
            </div>

            </div>
          
          
        </div>

        

      )
    }
  }