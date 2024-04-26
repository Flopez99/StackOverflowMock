import React from 'react';

export default class SearchBar extends React.Component {

    searchBar = (e) => {
      const searchString = (e.target.value)
      if(e.key ==='Enter'){
       
        this.props.handleSearch(searchString.toLowerCase())
      }    
    }
  
    render(){
      return(
      <div className="searchBar">
        <input onKeyDown={this.searchBar} id = "searchBar1" type="text" placeholder="Search..."></input>
      </div>
      )
    }
  }
  