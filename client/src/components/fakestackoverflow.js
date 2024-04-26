import React from 'react';
import MainPage from './MainPage.js';
import Banner from './Banner.js'
import axios from 'axios'
export default class FakeStackOverflow extends React.Component {
 
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'QuestionsPage',
      currentSearch: '',
      currentTag: '',
      user:'',
      currentEdit: '',
      currentAnswer:''
    }
    this.getUser()
  }
  getUser(){
    axios.get('http://localhost:8000/loggedIn')
      .then((res) => {
          if(res.data.loggedIn === true){
              this.setState({user: res.data.user[0]})
          }
      }
      )
  }
  //methods to be passed down to children to change the parent state

  handlePage = (page) => {
    this.setState({currentPage: page})
  }

  handleCurrentTag = (tag, bool) => {


    if(bool){
      this.setState({currentTag: tag})
      this.handlePage("QuestionsOfTag")
    }else{
      this.setState({currentEdit: [tag, "Tag"]})
      this.handlePage("Edit")
    }
  }

  handleSearch = (search) => { 
    this.setState({currentSearch: search})
    this.handlePage("Searching")

  }


  setCurrentAnswer = (answer) => {

    this.setState({currentEdit: [answer, "Answer"]})
    this.handlePage("Edit")

  }

  setCurrentQuestion = (question, bool) => {

      const getQuestion = async () => {
        await axios.get('http://localhost:8000/getQuestions/' + question.qid)
          .then(res => {
            if(bool){
              this.setState({currentQuestion: res.data[0]})

              this.handlePage("AnswersPage")
            }else{
              this.setState({currentEdit: [res.data[0], "Question"]})
              this.handlePage("Edit")
            }
          })
        }

        getQuestion()

  }

  render() {

    return (
      <div>
        <Banner user = {this.state.user} logOutUser = {this.props.logOutUser} handleSearch = {this.handleSearch} handlePage = {this.handlePage} currentPage = {this.state.currentPage}/>
        <MainPage setCurrentAnswer = {this.setCurrentAnswer} currentEdit = {this.state.currentEdit} user = {this.state.user} handlePage = {this.handlePage} handleCurrentTag = {this.handleCurrentTag} setCurrentQuestion = {this.setCurrentQuestion} currentSearch = {this.state.currentSearch} currentTag = {this.state.currentTag} currentQ = {this.state.currentQuestion} currentPage = {this.state.currentPage}/>
      </div>
    ) 
  }
}



















