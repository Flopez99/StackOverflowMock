import React from 'react';
import axios from 'axios';

export default class AnswerQuestion extends React.Component{
    constructor(props){
      super(props)
  
      this.state = {
        answerText: '',
        answerUsername: '',
        errors: [],
        title: "Answer Question",
        buttonT: "Post Answer"
      }
    }

    componentDidMount(){
      if(this.props.title === "Edit Answer"){
        this.setState({title: "Edit Answer", buttonT: "Answer", answerText: this.props.answerData.text})

      }else if(this.props.title === "Edit Tag"){
        this.setState({title: "Edit Tag", buttonT: "Tag", answerText: this.props.tagData.name})

      }else{

      }
    }

    postAnswer(newAnswer){


      if(this.props.title === "Edit Tag"){

        axios.post('http://localhost:8000/updateTag', {
          new_tag: newAnswer,
          tag: this.props.tagData 
        }).then( res =>{
          this.props.handlePage("AccountPage")
        }
      )
      
      }else if(this.props.title === "Edit Answer"){
        axios.post('http://localhost:8000/updateAnswer', {
          new_answer: newAnswer,
          answer: this.props.answerData
        }).then( res =>{
          this.props.handlePage("AccountPage")
        }
      )

 
      }else{
        axios.post('http://localhost:8000/questions/addNewAnswer/', {
          new_answer: newAnswer,
          currentQuestion: this.props.currentQuestion,
          user: this.props.user    
         })
          .then(res => { 
            this.props.handlePage("AnswersPage")
          })  


      }
    }

    handleAnsTextChange = (event) =>{
      this.setState({
        answerText: event.target.value
  
      })
    }
  
    handleAnsUsernameChange = (event) =>{
      this.setState({
        answerUsername: event.target.value
  
      })
    }
  
  
    handleSubmit = (event) =>{
      let answerText = this.state.answerText
      let errorMsg = []

      this.setState({
        errors: [this.state.errors, []]
      })
  
      if (answerText.trim().length === 0 || answerText == null) {
        errorMsg.push('The text field is empty')
      }
    
      if(errorMsg.length > 0){
        this.setState({ errors: errorMsg })
        event.preventDefault()
  
      }else{
      
        const new_answer = {
          text: answerText,
          ans_by: this.props.user.username,
          ans_date_time: Date.now,
        };

        this.postAnswer(new_answer)
      
      }
      event.preventDefault()
    } 
    deleteItem = () =>{

      if(this.props.title === "Edit Answer"){
        axios.post('http://localhost:8000/answers/deleteAnswer', {id: this.props.answerData.aid})
        .then(res => {
          console.log(res.data)
          this.props.handlePage("AccountPage")

        })

      }else{
        axios.post('http://localhost:8000/tags/deleteTag', {id: this.props.tagData.tid})
        .then(res => {
          console.log(res.data)
          this.props.handlePage("AccountPage")

        })

      }

    }
  
    render(){
  
      let editT = ''
      if(this.props.isEdit)
      editT = "Edit " + this.state.buttonT
      else
      editT = "Edit Answer"

      return(
        <div id = "answer-question-form">
        <div id="error2">{this.state.errors.map(error =><p key = {error}>{error}</p>)}</div>
        <form onSubmit = {this.handleSubmit} id = "answer-question-form2">
        <h2 className = "answer-form-title">{this.state.title}</h2>
        <textarea onChange = {this.handleAnsTextChange} value = {this.state.answerText} className = "answer-form-text" name="" id="answer-text" cols="70" rows="10"></textarea>

        <br/>
        <button type = "submit" id = "post-answer" className= "submit-button">{editT}</button>
        <button type = "button" onClick = {() => this.deleteItem()} id = "post-answer" className = {this.props.isEdit === true ? "submit-button" : "hideTags"}>Delete {this.state.buttonT}</button>

        </form>

      </div>
      )
    }
  }
  