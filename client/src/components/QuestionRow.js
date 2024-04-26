import React from 'react';
import axios from 'axios';

export default class QuestionRow extends React.Component{

    constructor(props){
      super(props)
      this.state = {
        questionTags: [],
        numberOfAnswers: 0,
        votes: this.props.currQuestion.votes,
        alreadyVoted: 0
      }

    }

    view_question(question){
      
      if(this.props.keyP ==="userQuestions"){
        this.props.setCurrentQuestion(question, false)
      }else{

        axios.post('http://localhost:8000/questions/updateViews', {question: question})
        .then(res => {
          this.props.setCurrentQuestion(question, true)
        })
      }

      }
      
   
    componentDidMount(){
      let questionID = this.props.currQuestion.qid;  

      axios.get('http://localhost:8000/numberAnswersOfQuestion/' + questionID) 
      .then(res => {
        this.setState({numberOfAnswers: res.data.length})
      })  

      axios.get('http://localhost:8000/tagsOfQuestion/' + questionID)
          .then(res => {

            try {
              if(res.data[0].name) {
                this.setState({questionTags: res.data})
              }
            }
            catch(e) {
              this.setState({questionTags: []})
            }

           })
     }
 
    increaseVotes = () =>{

      if(this.props.user.reputation < 100){
        alert("Reputation is below 100. Vote not submitted")

        
      }else{
        let alreadyVoted = this.state.alreadyVoted

        if(alreadyVoted === 0 || alreadyVoted === -1){
          let questionID = this.props.currQuestion.qid;  
          axios.post('http://localhost:8000/changeVote', {questionID: questionID, isUpvote: true, isAns: false})
          .then(res => {
             this.setState({upvoted: false, votes: this.state.votes + 1, alreadyVoted: this.state.alreadyVoted + 1})
  
           })
        }      }
      
    }

    decreaseVotes = () =>{

      if(this.props.user.reputation < 100){

        alert("Reputation is below 100. Vote not submitted")

     
      }else{
        let alreadyVoted = this.state.alreadyVoted

        if(alreadyVoted === 0 || alreadyVoted === 1){
          let questionID = this.props.currQuestion.qid;  
          axios.post('http://localhost:8000/changeVote', {questionID: questionID, isUpvote: false, isAns: false })
              .then(res => {
                 this.setState({votes: this.state.votes - 1, alreadyVoted: this.state.alreadyVoted -1})
               })     
        }
      }

      }

    render(){

      let question = this.props.currQuestion;  
      let questionTags = this.state.questionTags;
 
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      let questionTime = new Date(question.ask_date_time)
      let askedOn = months[questionTime.getMonth()] + ' ' + questionTime.getDate() + ', ' + questionTime.getFullYear();
      let askedAt = questionTime.getHours() + ":" + questionTime.getMinutes();

      return(
             <>
              
              <td className="views">
              <div className='viewsColumn'>

              <div className='votes'>
              <button onClick={(() => this.increaseVotes())}>^</button>
              <p>{this.state.votes}</p>
              <button onClick={(() => this.decreaseVotes())}>v</button>
              </div>
              
              <div className = 'viewsAndAns'> 
              <h4>{question.views} Views</h4>
              <h4>{this.state.numberOfAnswers} Answers</h4>
              </div>
              </div>
             </td>
  
             <td className="question-title">
                     <a onClick = {() => this.view_question(question)} className = "titleNameClick"><h3>{question.qid + " " + question.title}</h3></a>
                     <p>{question.summary}</p>
                     <div className = "ulWrapperDiv"> 
                      <ul id = {question.qid}  className = "ulTags">    

                      {questionTags.map(qTag => <li key = {qTag.tid} className = "tagListItem">{qTag.name}</li>)}
                      
                      </ul>
                     </div>
                   </td>
  
             <td id="asked-at2">
                   <p>Asked By <span className = "usernameQ">{question.asked_by}</span></p>
                   <p>On <span className = "askedOnQ"> {askedOn}</span></p>
                   <p>At <span className = "askedAtQ">{askedAt}</span></p>
                   </td>
  
              </>
      )
    }
  }