import SearchBar from "./SearchBar";
import React from 'react';
import axios from "axios";

export default class Banner extends React.Component {

    constructor(props){
      super(props)
      this.state = {


      }
    }

    render() {
      let handler = this.props.handlePage;
      let currentPage = this.props.currentPage;
      let logOut = this.props.logOutUser;

      let username = ''
      let logOutTitle = ''

      if(this.props.user){
      username = this.props.user.username
      logOutTitle = "Log Out"
      }
      else{
      username = "Guest"
      logOutTitle = "Back to Welcome Page"
      }
      return (
  
      <div id="banner" className ="header">
      <div className="inner_header">
        <div className="logo_container">
          <h1> Fake Stack Overflow</h1>
        </div>
          <div className="navigation">
            <a onClick = {() => handler('QuestionsPage')} className = {currentPage === "QuestionsPage"  || currentPage === "Searching" ? "active" : "inactive"} id= "questionsPage">
            <li>Questions</li>
            </a>
            <a onClick = {() => handler('TagsPage')} className = {currentPage === "TagsPage" ? "active" : "inactive"} id = "tagsPage">
              <li>Tags</li>
            </a>

            <a onClick = {() => handler('AccountPage')} className = {currentPage === "AccountPage" && this.props.user ? "active" : "inactive"} id = "accountPage">
            <li className = {this.props.user ? "" : "hideTags"}>{username}</li>
            </a>

            <a onClick = {() => logOut()} className = "inactive" id = "logOut">
            <li>{logOutTitle}</li>
            </a>
           

          </div> 
          <SearchBar handlePage = {this.props.handlePage} handleSearch = {this.props.handleSearch}></SearchBar>
      </div>
    </div>)
    }
  }
  