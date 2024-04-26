import React from 'react';
import axios from 'axios';
export default class AskQuestionPage extends React.Component {
    constructor(props){
      super(props)
  
      this.state = {
        questionTitle: '',
        questionText: '',
        questionTags: '',
        questionSummary: '',
        errors: [],
        submitType:"Ask Question"
      }

    }

    componentDidMount(){
      if(this.props.isEdit){
        let questionData = this.props.questionData
        this.setState({
          questionTitle: questionData.title, 
          questionText: questionData.text,
          questionSummary: questionData.summary,
          submitType: "Edit Question" 
        })

        axios.get('http://localhost:8000/tagsOfQuestion/' + this.props.questionData.qid)
          .then(res => {

            let arrayString  = []

            try {
              if(res.data[0].name) {

                res.data.forEach((tag)=>{

                  arrayString.push(tag.name)
                })

                let string = arrayString.toString()

                string = string.replaceAll(',', ' ')
                this.setState({questionTags: string})
              }
            }
            catch(e) {
              this.setState({questionTags: []})
            }
           })
      }
    }
   
    addQuestion = (newQuestion) => { 


      if(this.props.isEdit){

          axios.post('http://localhost:8000/tags/getEveryTag', {new_question: newQuestion, user: this.props.user})
          .then(res =>{

            let canCreate = true

            if(this.props.user.reputation < 100){

              let isFound = ''
              let possible = []
              newQuestion.tags.forEach(tagName => {
                isFound = res.data.some(tag => {
                  console.log(tag)
                  if (tag.name === tagName) {
                    possible.push("1")
                    return true;
                  }}
                )
                })
    
                if(possible.length > 0){
                  canCreate = true
               }else{
                 canCreate = false
     
               }
            }
    
          if(canCreate === false){
            alert("Low Reputation. Cannot Create New Tags")
  
          }else{

          axios.post('http://localhost:8000/updateQuestion', {new_question: newQuestion, user: this.props.user, questionId: this.props.questionData.qid})
          .then(res =>{

          this.props.handlePage("AccountPage")
        })
       }
      })
      }else{

      axios.post('http://localhost:8000/tags/getEveryTag', {new_question: newQuestion, user: this.props.user})
      .then(res =>{


        let canCreate = true

        if(this.props.user.reputation < 100){

          let isFound = ''
          let possible = []
          newQuestion.tags.forEach(tagName => {
            isFound = res.data.some(tag => {
              console.log(tag)
              if (tag.name === tagName) {
                possible.push("1")
                return true;
              }}
            )
            })

          if(possible.length > 0){
             canCreate = true
          }else{
            canCreate = false

          }
        }

        if(canCreate === false){
          alert("Low Reputation. Cannot Create New Tags")
        }else{

          axios.post('http://localhost:8000/questions/addNewQuestion/', {
            new_question: newQuestion, user: this.props.user
           }).then(res => {
    
            if(res.data === "Low Reputation"){
              alert()
            }else{
              this.props.handlePage("QuestionsPage")
    
            }
    
           })
        }
      }
      ) 
    }
    }

    handleQTitleChange = (event) =>{
      this.setState({
        questionTitle: event.target.value
  
      })
    }
  
    handleQTextChange = (event) =>{
      this.setState({
        questionText: event.target.value
  
      })
    }
    handleQTagsChange = (event) =>{
      this.setState({
        questionTags: event.target.value
  
      })
    }
    handleQSummaryChange = (event) =>{
      this.setState({
        questionSummary: event.target.value
  
      })
    }
  

    handleSubmit = (event) =>{
      let questionTitle = this.state.questionTitle
      let questionText = this.state.questionText
      let questionTags = this.state.questionTags
      let summary = this.state.questionSummary
      let errorMsg = []
      this.setState({
        errors: [this.state.errors, []]
      })
  
      if (questionTitle.trim().length === 0 || questionTitle == null) {
        errorMsg.push('A question title is required.')
      }
    
      if (questionTitle.length > 100) {
        errorMsg.push('Question title is over 100 characters.')
  
      }
    
      if (questionText.trim().length === 0 || questionText == null) {
        errorMsg.push('A question text is required.')
  
      }
    
      if (summary.length > 140) {
        errorMsg.push('Summary is more than 140 characters')
  
      }
      if(errorMsg.length > 0){
        this.setState({ errors: errorMsg })
        event.preventDefault()
  
  
      }else{
      
        let tags = questionTags.split(/\s+/)    
        let tagIdsDone = []
        
        tags.forEach(tag => {
          tag = tag.toLowerCase().trim()
          if(!tagIdsDone.includes(tag))
           tagIdsDone.push(tag)
        });

      const new_question = {
    
        title: questionTitle,
        text: questionText,
        tags: tagIdsDone,
        answers: [],
        summary: summary,
        ask_date_time: '',
        views: 0,
      };


      this.addQuestion(new_question)

    }

      event.preventDefault()

    }

    deleteItem = () =>{


      axios.post('http://localhost:8000/questions/deleteQuestion', {id: this.props.questionData.qid})
      .then(res => {
        console.log(res.data)
        this.props.handlePage("AccountPage")
      })

    }

    

    render(){
      return(
  
        <div id="question-form" className="question-form">
        <div id="error">{this.state.errors.map(error => <p>{error}</p>)}</div>
  
        <form onSubmit = {this.handleSubmit} id="form" className="make-question">
    
          <h2 className="top-text" htmlFor="question-title">Question Title</h2><br/>
          <p className="sub-text">This should not be more than 100 characters.</p>
          <textarea  onChange = {this.handleQTitleChange} value = {this.state.questionTitle} className="user-text" id="question-title" name="title" rows="3" cols="100"></textarea>
    
          <h2 className="top-text" htmlFor="question-text">Question Text</h2><br/>
          <p className="sub-text">Add details.</p>
          <textarea onChange = {this.handleQTextChange} value = {this.state.questionText} className="user-text" id="question-text" name="text" rows="5" cols="100"></textarea>
    
        
          <h2 className="top-text" htmlFor="question-tags">Tags</h2><br/>
          <p className="sub-text">Add Keywords separated by whitespace.</p>
          <textarea onChange = {this.handleQTagsChange} value = {this.state.questionTags} className="user-text" id="question-tags" name="tags" rows="3" cols="100"></textarea>
        
          <h2 className="top-text" htmlFor="username">Summary</h2><br/>
          <p className="sub-text">Should not be more than 140 characters.</p>
          <textarea onChange = {this.handleQSummaryChange} value = {this.state.questionSummary} className="user-text" id="username" name="username" rows="4" cols="100"></textarea> <br/>
          <button type = "submit" className="submit-button" name="button">{this.state.submitType}</button>
          <button type = "button" onClick = {() => this.deleteItem()} id = "post-answer" className = {this.props.isEdit === true ? "submit-button" : "hideTags"}>Delete Question</button>

        </form>
  
      </div>
      )
    }
  }