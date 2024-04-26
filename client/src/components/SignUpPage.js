import React from 'react';
import axios from 'axios';


export default class WelcomePage extends React.Component {    

    constructor(props){
        super(props)
        this.state = {
            username:'',
            email: '',
            password:'',
            verifyPassword: '',
            errors: []
        }
        axios.defaults.withCredentials = true;

    }

    componentDidMount(){
        axios.get('http://localhost:8000/loggedIn')
        .then((res) => {
            console.log(res)
            if(res.data.loggedIn === true){
                console.log(res.data.user[0].email)
                this.setState({username: res.data.user[0].email})
            }
        }
        )
    } 
    handleUsername = (e) => {
        this.setState({username: e.target.value})
    }
    handleEmail = (e) => {
        this.setState({email: e.target.value})
    }
    handlePassword = (e) => {
        this.setState({password: e.target.value})
    }
    handlePasswordVerify = (e) => {
        this.setState({verifyPassword: e.target.value})
    }

    register = () => {
        axios.post('http://localhost:8000/register', {username: this.state.username, email: this.state.email, password: this.state.password, verifyPassword: this.state.verifyPassword})
        .then((res) => {
            if(res.data.passedValidation){
                this.props.changeUserStatus("Welcome Page")
            }else{
                this.setState({errors: res.data.errors})
            }
        })
    }

    render() {
    return (
        <div className='welcomeDiv'>
            <h1 className='welcomeTitle'>Welcome, To FakeStackOverflow</h1>

            <div className='parentDiv'>
            <div className='loginDiv'>
                <h1>Sign Up Form</h1>
                <div>
                    <input onChange = {this.handleUsername} value = {this.state.username} type= "text" name='' placeholder='Enter Username'></input>
                    <input onChange = {this.handleEmail} value = {this.state.email} type= "text" name='' placeholder='Enter Email'></input>
                    <input onChange = {this.handlePassword} value = {this.state.password} type= "password" name='' placeholder='Enter Password'></input>
                    <input onChange = {this.handlePasswordVerify} value = {this.state.verifyPassword} type= "password" name='' placeholder='Verify Password'></input>

                </div>
                <div>
                    <button onClick = {() => this.props.changeUserStatus("Welcome Page")} className = 'authButton'>Back</button>
                    <button onClick = {this.register} className = 'authButton'>Sign Up</button>
                </div>
            </div>
        
            <div className = "errorDiv">
                <ul>
                    {this.state.errors.map(error => <li>{error}</li>)}
                </ul>   
            </div>
        </div>
        </div>
        

            )
        }
}