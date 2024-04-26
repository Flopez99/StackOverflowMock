import QuestionRow from "./QuestionRow";
import AskButton from "./AskButton";
import React from 'react';
import axios from "axios";
import NextPrev from './NextPrev'
export default class QuestionTable extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      questions: [],
      currentSearch: '',
      title: this.props.title,
      offset: 0,
      questionsToDisplay: [],
      userQ: "",
      previous: false,
      next: false
    }

    if(this.props.keyP === "allQuestions"){
      this.initialGetQuestions() 
    }else if(this.props.keyP === "tagQuestions"){
      this.getQuestionsOfTag()
    }else if(this.props.keyP === "Searching"){
      this.filterQuestions()
    } else if(this.props.keyP === "UserQuestions"){
      this.getUserQuestions()
    }
  } 

  setCurrentSearch = () => {
    this.setState({currentSearch: this.props.currentSearch})
  }

  componentDidMount(){

    if(this.props.keyP === "allQuestions"){
      this.initialGetQuestions() 
    }else if(this.props.keyP === "tagQuestions"){
      this.getQuestionsOfTag()
    }else if(this.props.keyP === "Searching"){
      this.filterQuestions()
    }else if(this.props.keyP === "userQuestions"){
      this.getUserQuestions()
  }
  }

  filterQuestions = async () => {
    let searchString = this.props.currentSearch;
    let searchArray = searchString.split(' ')
    
    if (searchString.length === 0) {
      this.props.handlePage("QuestionsPage")
    }else{

    for(let word of searchArray){
      
      await axios.get('http://localhost:8000/searching/' + word)
      .then((res) =>{

        let filteredQuestions = res.data
        for(let question of filteredQuestions){

          let index = this.state.questions.findIndex(x => x.qid === question.qid)
          if (index === -1) {
          let array = this.state.questions
          array.push(question)
          this.setState({ questions: array})
        }else {

        }

        }
      }).then(res => {
        this.setState({questionsToDisplay: this.state.questions.slice(0, 5)})
        if(this.state.questions.length > 0){
            this.setState({title:'Search Results'})
    
        }else{
          this.setState({title:'No Results'})
        }
        if(this.state.questions.length > 5)
        this.setState({next: true})  
      })
   }
  
    }
  }

  getUserQuestions = async () => {
    await axios.post('http://localhost:8000/questions/getUserQuestions/', {user: this.props.user, offset: this.state.offset})
         .then((res) =>  {
          this.setState({questions:res.data})
          this.setState({questionsToDisplay: res.data.slice(0, 5)})       
          this.setState({userQ: " Made"})

          if(res.data.length > 5)
          this.setState({next: true})


          if(res.data.length === 0){
            this.setState({title: "No Questions Made"})
          }

        }) 
  }
 
  getQuestionsOfTag = async () => {
    await axios.get('http://localhost:8000/tags/questionsOfTag/' + this.props.currentTag.tid)
         .then((res) =>  {
          this.setState({questions: res.data})
          this.setState({questionsToDisplay: res.data.slice(0, 5)})

          if(res.data.length > 5)
          this.setState({next: true})        
        }) 
  }

  initialGetQuestions = async () => {
       axios.get('http://localhost:8000/getAllQuestions/' + this.state.offset)
      .then((res) =>  {
       this.setState({questions: res.data})
       this.setState({questionsToDisplay: res.data.slice(0, 5)})
       
       if(res.data.length > 5)
       this.setState({next: true})   

       if(res.data.length === 0)
       this.setState({title: "No Questions to Display"})

     })
    }
 
 
  getQuestionPage = async (posNeg) => {
   

    if((this.state.offset + posNeg > 0)){
      this.setState({previous:true})
    }else{
      this.setState({previous:false})
    }

    if((this.state.offset + posNeg + 1) * 5 <= this.state.questions.length && this.state.questions.length > 5){
      this.setState({next:true})
    }else{
      this.setState({next:false})
    }


    if(this.state.questions.length > 5){

    if(this.state.offset + posNeg >= 0){

      if((this.state.offset + 1) * 5 < this.state.questions.length){

        this.setState({offset: this.state.offset + posNeg}, () => {

            this.setState({questionsToDisplay: this.state.questions.slice(this.state.offset * 5, this.state.offset * 5 + 5)})
        })
        }else{


          if(posNeg === -1){
            this.setState({next:true})
            console.log("YEA HERE")

            this.setState({offset: this.state.offset + posNeg}, () => {
              this.setState({questionsToDisplay: this.state.questions.slice(this.state.offset * 5, this.state.offset * 5 + 5)})
          })
          }else{
          }
        }
      }else{
        this.setState({previous:false})

      }
    }else{
    }

    
  } 

    render() {
    
      return( 
        <>
        <div id="question-table" className="table-header">
          <table id="top-table">  
          <tbody className = "top-table-body">
            <tr>
              <th>
                <h3 id="question-count">{this.state.questions.length} Question/s {this.state.userQ}</h3>
              </th>
              <th>
                <h3>{this.state.title}</h3>
              </th>
              <th className ={this.props.user ? "" : "hideTags"} ><AskButton keyP = {this.props.keyP} handlePage = {this.props.handlePage}/></th>
            </tr>
              {this.state.questionsToDisplay.map(question => <tr className="questionRow" key = {question.qid}><QuestionRow keyP = {this.props.keyP} user = {this.props.user} setCurrentQuestion = {this.props.setCurrentQuestion} currQuestion = {question}/></tr>)}
            </tbody>
          </table>
        </div> 
        <div>
        <NextPrev notComment = {true}  key = {Date.Now} getData = {this.getQuestionPage} next = {this.state.next} prev = {this.state.previous}/>
        </div>
        </>
        )
    }
  }
  
  