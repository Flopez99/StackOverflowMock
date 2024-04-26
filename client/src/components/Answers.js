import React from 'react';
import AnswerRow from './AnswerRow';
import axios from 'axios';
import NextPrev from './NextPrev'

export default class Answers extends React.Component {

    constructor(props){
        super(props)
  
        this.state = {
          answers: [],
          offset: 0,
          answersToDisplay: [],
          title:"",
          previous: false,
          next: false
        }
      }

      getAnswerPage = async (posNeg) => {


        if((this.state.offset + posNeg > 0)){
          this.setState({previous:true})
        }else{
          this.setState({previous:false})
        }
    
        if((this.state.offset + posNeg + 1) * 5 <= this.state.answers.length && this.state.answers.length > 5){
          this.setState({next:true})
        }else{
          this.setState({next:false})
        }


        if(this.state.offset + posNeg >= 0){

    
          if((this.state.offset + 1) * 5 < this.state.answers.length){

            this.setState({offset: this.state.offset + posNeg}, () => {
                this.setState({answersToDisplay: this.state.answers.slice(this.state.offset * 5, this.state.offset * 5 + 5)})
            })

            }else{
              if(posNeg === -1){
                this.setState({offset: this.state.offset + posNeg}, () => {
                  this.setState({answersToDisplay: this.state.answers.slice(this.state.offset * 5, this.state.offset * 5 + 5)})
                  this.setState({next:true})
              })
              }
            }

        }else{
          this.setState({previous:false})

        }
        }
        
      componentDidMount(){
        this.getInitialAnswers()
      
      }
        
      getInitialAnswers(){
        if(this.props.keyP === "User Answers"){
          axios.get('http://localhost:8000/getUserAnswers/' + this.props.user.userId) 
           .then(res => {
            this.setState({answers: res.data})
            this.setState({answersToDisplay: res.data.slice(0, 5)})
            
            if(res.data.length === 0)
              this.setState({title:"No Answers Made"})
            else
            this.setState({title:"All Answers"})

            if(res.data.length > 5)
            this.setState({next: true})
            })
  
            
        }else{
  
          let questionID = this.props.currentQuestion.qid
    
          axios.post('http://localhost:8000/answersOfQuestion/',{questionID: questionID, offset: this.state.offset}) 
          .then(res => {
            this.setState({answers: res.data})
            this.setState({answersToDisplay: res.data.slice(0, 5)})    


            if(res.data.length > 5)
            this.setState({next: true})
          })        
        }
      }


        render() {   //Render the main page conditionally acording to the parent's state
            
  
            return(
            <>
            <div className ={this.props.isEdit === true ? "middleTitle" : "hideTags"}><h3>{this.state.title}</h3></div>
            <div id = "question-answers">
                {this.state.answersToDisplay.map(answer => <AnswerRow setCurrentAnswer = {this.props.setCurrentAnswer} isEdit = {this.props.isEdit} user = {this.props.user} key = {answer.aid} actualAnswer = {answer} />)}

            </div>
            <div>
              <NextPrev notComment = {true}  key = {Date.Now} getData = {this.getAnswerPage} next = {this.state.next} prev = {this.state.previous}/>
            </div>
            </>
            )
    }

  }