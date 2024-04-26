import React from 'react';
import axios from 'axios';
import Comment from './Comment';
export default class AnswerRow extends React.Component{

  constructor(props){
    super(props)
    this.state = {

      votes: this.props.actualAnswer.votes,
      alreadyVoted: 0

    }

  }

  increaseVotes = () =>{

    if(this.props.user.reputation < 100){

      alert("Reputation is below 100. Vote not submitted")
    }else{
    let alreadyVoted = this.state.alreadyVoted

    if(alreadyVoted === 0 || alreadyVoted === -1){
      let questionID = this.props.actualAnswer.aid;  
      axios.post('http://localhost:8000/changeVote', {questionID: questionID, isUpvote: true, isAns: true})
      .then(res => {
         this.setState({upvoted: false, votes: this.state.votes + 1, alreadyVoted: this.state.alreadyVoted + 1})

       })
    }
  }}

  decreaseVotes = () =>{

    if(this.props.user.reputation < 100){

      alert("Reputation is below 100. Vote not submitted")

    }else{

    let alreadyVoted = this.state.alreadyVoted

    if(alreadyVoted === 0 || alreadyVoted === 1){
      let questionID = this.props.actualAnswer.aid;  
      axios.post('http://localhost:8000/changeVote', {questionID: questionID, isUpvote: false, isAns: true })
          .then(res => {
             this.setState({votes: this.state.votes - 1, alreadyVoted: this.state.alreadyVoted -1})
           })     
     }
    }
    }

    view_answer = () =>{

      if(this.props.isEdit){
        this.props.setCurrentAnswer(this.props.actualAnswer)

      }else{

      }
    }
 

    render(){
      let answer = this.props.actualAnswer
      
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      let answerTime = new Date(answer.ans_date_time)
      let ansOn = months[answerTime.getMonth()] + ' ' + answerTime.getDate() + ', ' + answerTime.getFullYear();
      let ansAt = answerTime.getHours() + ":" + answerTime.getMinutes();

      return(
      <>
      <div className='wrapperAnsDiv'>
        <div className='votesAns'>
              <button onClick={(() => this.increaseVotes())}>^</button>
              <p>{this.state.votes}</p>
              <button onClick={(() => this.decreaseVotes())}>v</button>
        </div>

        <div className='ansChild1'>
        <a onClick = {() => this.view_answer()} className = {this.props.isEdit === true ? "titleNameClick" : ""}><p>{answer.aid + " " + answer.text}</p></a>
        </div>
  
        <div className = 'ansChild2'>
          <p>Ans By <span id = "askedByP">{answer.ans_by}</span></p>
          <p>On <span id = "askedOnP">{ansOn}</span></p>
          <p>At <span id = "askedAtP">{ansAt}</span></p>
        </div>
      </div>
      <Comment user = {this.props.user} answer = {this.props.actualAnswer} key={"answerComments"} keyP={"answerComments"}/>
      <hr className='qDivider'/>

      </>
      )
    }
  }
  