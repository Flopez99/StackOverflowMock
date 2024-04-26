import React from 'react';


export default class AskButton extends React.Component {

    render(){
      let handler = this.props.handlePage;
  
      return(
        <button onClick = {() => handler('AskQuestionPage')} id="ask-button" className ={this.props.keyP === "userQuestions" || this.props.keyP === "userTags" ? "hideTags" : "ask-button-header"} name="button">Ask a Question</button>
      )
    }
  }
  