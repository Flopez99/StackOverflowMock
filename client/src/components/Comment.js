import axios from 'axios';
import React from 'react';
import NextPrev from './NextPrev'

export default class Comment extends React.Component {

    constructor(props){
        super(props)
        this.state = {
        comments: [], 
        commentString: '',
        error: '',
        offset: 0,
        start: 0,
        commentsToDisplay:[]

        }


    }
    componentDidMount(){
        this.getComments()
    } 

    getComments(){

        if(this.props.keyP === "questionComments"){
            this.setState({isQuestion: true})

            axios.post('http://localhost:8000/comment/getQuestionComments', {id: this.props.question.qid,offset: this.state.start, isQuestion: true})
            .then(res => {
                this.setState({comments: res.data})
                this.setState({commentsToDisplay: res.data.slice(0, 3)})  

                if(res.data.length > 3)
                this.setState({next: true})
       

            })
        }else{
            this.setState({isQuestion: false})

            axios.post('http://localhost:8000/comment/getQuestionComments', {id: this.props.answer.aid,offset: this.state.start, isQuestion: false})
            .then(res => {
                this.setState({comments: res.data})
                this.setState({commentsToDisplay: res.data.slice(0, 3)})  


                if(res.data.length > 3)
                this.setState({next: true})
      

            })
        }
    }

    getCommentsPage = async (posNeg) => {

        if((this.state.offset + posNeg > 0)){
            this.setState({previous:true})
          }else{
            this.setState({previous:false})
          }
      
          if((this.state.offset + posNeg + 1) * 3 <= this.state.comments.length && this.state.comments.length > 3){
            this.setState({next:true})
          }else{
            this.setState({next:false})
          }



        if(this.state.offset + posNeg >= 0){
            if((this.state.offset + 1) * 3 < this.state.comments.length){

                this.setState({offset: this.state.offset + posNeg}, () => {
                    this.setState({commentsToDisplay: this.state.comments.slice(this.state.offset * 3, this.state.offset * 3 + 3)})
                })
                }else{
                  if(posNeg === -1){
                    this.setState({offset: this.state.offset + posNeg}, () => {
                      this.setState({commentsToDisplay: this.state.comments.slice(this.state.offset * 3, this.state.offset * 3 + 3)})
                      this.setState({next:true})

                  })
                  }
                }
        }else{
            this.setState({previous:false})

        }
      } 


    handleComment = (e) => {
        this.setState({commentString: e.target.value})
    }
    
    makeComment = (e) =>{
        if(e.key ==='Enter'){
            const comment = (this.state.commentString)

            if(comment.trim().length > 0 & comment.length < 140 & this.props.user.reputation > 100){

                let id = ''
                if(this.state.isQuestion)
                id = this.props.question.qid
                else
                id = this.props.answer.aid
    
                axios.post('http://localhost:8000/comment/makeComment',{comment: comment, username: this.props.user.username, isQuestion: this.state.isQuestion, id: id})
                .then(res => {
                    this.setState({commentString: ""})
                    this.setState({error: "", offset: 0})

                    this.getComments()
                })       

            }else{

                if(this.props.user.reputation < 100){
                    this.setState({error: "Reputation is Below 100"})
                }
                else if(comment.trim.length === 0 ){
                    this.setState({error: "Comment is Empty"})
                }else{
                    this.setState({error: "140 Characters Exceeded"})
                }
            }
           
        }
    }

    render(){  
      return(
        <div className="questionComments"> 
            {this.state.commentsToDisplay.map(answer => <p key = {answer.cId}>{answer.text}<span className='usernameC'> - {answer.username}</span></p>)}
        <div>
        <NextPrev isComment = {true} key = {Date.Now} getData = {this.getCommentsPage} next = {this.state.next} prev = {this.state.previous}/>   
        </div>
        <div className='ansCerror'>
          <div className='ansCChild'>
            <input value = {this.state.commentString} onChange = {this.handleComment} onKeyDown = {this.makeComment} size = {50} placeholder='Make a Comment'></input>
          </div>
          <div className='errorC'>
            <p>{this.state.error}</p>
          </div>
        </div>
      </div>     
       )
    }
  }
  