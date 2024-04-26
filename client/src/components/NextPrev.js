import React from 'react';


export default class AskButton extends React.Component {

    render(){
  
      return(




        <div className ={this.props.isComment === true ? "nextPrevComment" : "nextPrevDiv"} >

        <button className ={this.props.prev === true ? "nextPrev" : "nextPrevDis"} onClick = {() => this.props.getData(-1)}>Previous Page</button>
        <button className ={this.props.next === true ? "nextPrev" : "nextPrevDis"} onClick = {() => this.props.getData(1)}>Next Page</button>       
        </div> 
        
        )
    }
  }
  