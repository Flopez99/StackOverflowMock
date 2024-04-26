import Answers from './Answers';
import React from 'react';
import axios from 'axios';
import Comment from './Comment';
export default class AnswerPage extends React.Component{

    constructor(props){
      super(props)

      this.state = {
        answers: [],
        questionTags: [],
        currentQuestion: this.props.currentQuestion,
        votes: 0,
        alreadyVoted: 0
      }

    }
    componentDidMount(){
      let questionID = this.state.currentQuestion.qid

      axios.get('http://localhost:8000/numberAnswersOfQuestion/' + questionID) 
      .then(res => {
        this.setState({numberOfAnswers: res.data.length})
      })  
      
      axios.get('http://localhost:8000/tagsOfQuestion/' + questionID)
      .then(res => {
             this.setState({questionTags: res.data})
           })
      }

      increaseVotes = () =>{
        let alreadyVoted = this.state.alreadyVoted
        if(this.props.user.reputation < 100){

          alert("Reputation is below 100. Vote not submitted")
        }else{

        if(alreadyVoted === 0 || alreadyVoted === -1){
          let questionID = this.props.currentQuestion.qid;  
          axios.post('http://localhost:8000/changeVote', {questionID: questionID, isUpvote: true, isAns: false})
          .then(res => {
             this.setState({upvoted: false, votes: this.state.votes + 1, alreadyVoted: this.state.alreadyVoted + 1})
  
           })
        }
      }

      }
    
  
      decreaseVotes = () =>{
        if(this.props.user.reputation < 100){

          alert("Reputation is below 100. Vote not submitted")
        }else{



        let alreadyVoted = this.state.alreadyVoted
  
        if(alreadyVoted === 0 || alreadyVoted === 1){
          let questionID = this.props.currentQuestion.qid;  
          axios.post('http://localhost:8000/changeVote', {questionID: questionID, isUpvote: false, isAns: false })
              .then(res => {
                 this.setState({votes: this.state.votes - 1, alreadyVoted: this.state.alreadyVoted -1})
               })     
        }
      }
        }
    render(){
      let question = this.state.currentQuestion
            
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      let questionTime = new Date(question.ask_date_time)
      let askedOn = months[questionTime.getMonth()] + ' ' + questionTime.getDate() + ', ' + questionTime.getFullYear();
      let askedAt = questionTime.getHours() + ":" + questionTime.getMinutes();
 
      return(
        <div id = "answersPage" className="table-header">
  
        <table id="top-table-a">
        <tbody>
          <tr> 
            <th>
              <h3 id="answer-count">{this.state.numberOfAnswers} Answers</h3>
            </th>
            <th>
              <h3 id = 'question-title-ans'>{question.title}</h3>

              <div className = "ulWrapperDiv"> 
                    <ul id = {question.qid}  className = "ulTags">    
                      {this.state.questionTags.map(qTag => <li key = {qTag.tid} className = "tagListItem">{qTag.name}</li>)}
                    </ul>
              </div>

            </th>
            <th><button onClick = {() => this.props.handlePage('AskQuestionPage')} id="ask-button2" className ={this.props.user ? "ask-button-header" : "hideTags"}>Ask Question</button></th>
          </tr>
            <tr>
            
              <td id="views">
                <h3><span id = "viewsNum">{question.views}</span> Views</h3>

                <div className='votesQ'>
                <button onClick={(() => this.increaseVotes())}>^</button>
                <p>{this.state.votes}</p>
                <button onClick={(() => this.decreaseVotes())}>v</button>
                </div>
              </td>
      
              <td className="question-title">
              <p>Summary: </p>
              <p>{question.summary}</p>
              <br/>
              <p>Main Text: </p>
              <p id = "question-text-display">{question.text}</p>
              
              </td>
  
              <td id="asked-at">
                <div id = "wrapper-info">      
                <p>Asked By <span id = "askedByP">{question.asked_by}</span></p>
                <p>On <span id = "askedOnP">{askedOn}</span></p>
                <p>At <span id = "askedAtP">{askedAt}</span></p>
                </div>
              </td>
              </tr>
            </tbody>
    
        </table>

        <Comment key={"questionComments"} keyP={"questionComments"} question = {question} user = {this.props.user} />

        <hr className='qDivider'/>
        <Answers isEdit = {false} key = {"All Answers"} keyP = {"All Answers"} currentQuestion = {question} user = {this.props.user}/>
  
        <div id = "answerQuestionDiv" className ={this.props.user ? "" : "hideTags"} >
          <button onClick = {() => this.props.handlePage('AnswerQuestionForm')} id = "answerQuestionButton">Answer Question</button>
        </div>
  
  
      </div>
      )
    }
  
  }