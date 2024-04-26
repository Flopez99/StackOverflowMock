import React from 'react';
import axios from 'axios';

export default class TagComponent extends React.Component{

    constructor(props){
      super(props)
      this.state = {numberOfQuestions: 0}
    }
    componentDidMount(){
      this.setQuestions()

    }

    seeTag(tag){

      if(this.props.keyP === "userTags"){
        this.props.handleCurrentTag(tag, false)

      }else{
        this.props.handleCurrentTag(tag, true)

      }
    
    }

    setQuestions(){
      axios.get('http://localhost:8000/tags/questionsOfTag/' + this.props.tag.tid)
      .then(res => {this.setState({numberOfQuestions: res.data.length})})  
   }
   
    render(){ 

      return(
        <div className = "display-tag-div Child-Elements">
          <button onClick = {() => this.seeTag(this.props.tag)} className = "tag-button">{this.props.tag.name}</button>
          <p>{this.state.numberOfQuestions} Questions</p>
        </div>
      
      ) 
    }
  }