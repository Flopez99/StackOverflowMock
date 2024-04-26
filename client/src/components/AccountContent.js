import React from 'react';
import QuestionTable from './QuestionTable'
import TagsPage from './TagsPage'
import Answers from './Answers';

export default class AccountContent extends React.Component {
 
        render() {   //Render the main page conditionally acording to the parent's state

            switch(this.props.accountPage){
      
              case 'User Questions':
                let title = "All Questions"
                return <QuestionTable user = {this.props.user} isEdit = {true} keyP="userQuestions" key="userQuestions" handlePage = {this.props.handlePage} setCurrentQuestion = {this.props.setCurrentQuestion} title = {title}/>
            
              case 'User Answers':

                return <Answers setCurrentAnswer = {this.props.setCurrentAnswer} isEdit = {true} key = "User Answers" keyP = "User Answers" user = {this.props.user} setCurrentQuestion = {this.props.setCurrentQuestion} handlePage = {this.props.handlePage}/>
              case 'User Tags':

                return <TagsPage key = "userTags" keyP = "userTags" isEdit = {true} user = {this.props.user} handleCurrentTag = {this.props.handleCurrentTag} handlePage = {this.props.handlePage}/>
            
                default:  
                console.log("no page found")
                return null
            }
      
    }
  }