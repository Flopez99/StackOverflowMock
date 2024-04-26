import QuestionTable from './QuestionTable'
import TagsPage from './TagsPage'
import AskQuestionPage from './AskQuestionPage'
import AnswerQuestion from './AnswerQuestion'
import React from 'react';
import AnswerPage from './AnswerPage.js';
import AccountPage from './AccountPage';
import Edit from './Edit';
export default class MainPage extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        questions: [], // Questions to be displayed
        tags: [],
        currentSearch: this.props.currentSearch
      }
    } 
   
  
    render() {   //Render the main page conditionally acording to the parent's state

      switch(this.props.currentPage){

        case 'QuestionsPage':
          let title = "All Questions"
        
          return <QuestionTable user = {this.props.user} keyP="allQuestions" key="allQuestions" handlePage = {this.props.handlePage} setCurrentQuestion = {this.props.setCurrentQuestion} title = {title}/>
      

        case 'Edit':
          let data = this.props.currentEdit[0]
          let typeOfEdit = this.props.currentEdit[1]

          console.log(this.props.currentEdit)
 
          return <Edit key = {typeOfEdit} keyP = {typeOfEdit} data = {data} user = {this.props.user} handleCurrentTag = {this.props.handleCurrentTag} handlePage = {this.props.handlePage}/>

        case 'TagsPage':

          return <TagsPage key = "allTags" keyP = "allTags" handleCurrentTag = {this.props.handleCurrentTag} handlePage = {this.props.handlePage}/>
        
        case 'AskQuestionPage':
          return <AskQuestionPage key = "askQuestion" keyP = "askQuestion" user = {this.props.user} setCurrentQuestion = {this.props.setCurrentQuestion} handlePage = {this.props.handlePage}/>
       
        case 'AnswersPage':

          return <AnswerPage key = "User Answers" keyP = "User Answers"  user = {this.props.user} setCurrentQuestion = {this.props.setCurrentQuestion} handlePage = {this.props.handlePage} currentQuestion = {this.props.currentQ}/>
       
        case 'AnswerQuestionForm':
 
          return <AnswerQuestion user = {this.props.user} currentQuestion = {this.props.currentQ} handlePage = {this.props.handlePage} setCurrentQuestion = {this.props.setCurrentQuestion} addAnswer = {this.addAnswer}/>
        
        case 'QuestionsOfTag':
          let qOfTag = this.props.currentTag;
          let titleTag = "Questions tagged ["+ qOfTag.name + "]";
 
          return <QuestionTable keyP="tagQuestions"  key="tagQuestions" setCurrentQuestion = {this.props.setCurrentQuestion} title = {titleTag} handlePage = {this.props.handlePage} currentTag = {this.props.currentTag}/>
          
        case 'AccountPage':

          let isUser = true

          if(this.props.user){

          }else{
            isUser = false
          }


          return <AccountPage isUser = {isUser} setCurrentAnswer = {this.props.setCurrentAnswer} setCurrentQuestion = {this.props.setCurrentQuestion} handlePage = {this.props.handlePage} handleCurrentTag = {this.props.handleCurrentTag} user = {this.props.user}/>
          
        case 'Searching':
          let searchString = this.props.currentSearch;
  
          return <QuestionTable keyP="Searching" key={searchString} handlePage = {this.props.handlePage} setCurrentSearch = {this.setCurrentSearch} setCurrentQuestion = {this.props.setCurrentQuestion} currentSearch = {searchString} handler = {this.props.handler}/>
   
          default:  
          console.log("no page found")
          return null
      }
    }
  }