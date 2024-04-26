import React from 'react';
import AnswerQuestion from './AnswerQuestion';
import AskQuestionPage from './AskQuestionPage';


export default class Edit extends React.Component {

    render(){
    

    
    switch(this.props.keyP){

        case 'Question':
            let title1 = "Edit Question"

            console.log(this.props.data)
            return <AskQuestionPage user = {this.props.user} handlePage = {this.props.handlePage} questionData= {this.props.data} isEdit = {true} />

        case 'Answer':
            let title2 = "Edit Answer"
          
            return <AnswerQuestion user = {this.props.user} answerData = {this.props.data} handlePage = {this.props.handlePage} title = {title2} isEdit = {true} />

        case 'Tag':
            let title3 = "Edit Tag"
              
            return <AnswerQuestion user = {this.props.user} title = {title3} tagData = {this.props.data} handlePage = {this.props.handlePage} isEdit = {true} />
    
        default:
            return "No page found"
    }
    }
  }
  