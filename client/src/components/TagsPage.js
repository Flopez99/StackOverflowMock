import AskButton from "./AskButton"
import TagComponent from "./TagComponent"
import React from 'react';
import axios from "axios";

export default class TagsPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    allTags: [],
    title: "All Tags",
    made: ""
    }

  }
  componentDidMount(){

    if(this.props.keyP === "userTags"){
      axios.get('http://localhost:8000/getUserTags/' + this.props.user.userId) 
     .then(res => {
      this.setState({allTags: res.data})
      this.setState({made: " Made"})


      if(res.data.length === 0)
      this.setState({title:"No Tags Made"})

      })

    }else{
    axios.get('http://localhost:8000/getTags') 
    .then(res => {
      this.setState({allTags: res.data})
      if(res.data.length === 0)
      this.setState({title: "No Tags to Display"})

      })
    }
   }

    render() {
  
      let allTags = this.state.allTags
      
      return(
  
        <div id = "tags-page" className="table-header">
        <table id="top-table">
        <tbody>
          <tr>
            <th>
              <h3 id="tag-count">{allTags.length} Tag/s {this.state.made}</h3>
            </th>
            <th>
              <h3>{this.state.title}</h3>
            </th>
            <th><AskButton keyP = {this.props.keyP} handlePage = {this.props.handlePage}/></th>
          </tr>
          </tbody>
        </table>
        
        <div id = "all-tags-shown" className = "Main-Container">
          {allTags.slice().reverse().map(tag => <TagComponent key = {tag.tid} keyP = {this.props.keyP} handleCurrentTag = {this.props.handleCurrentTag} tag = {tag} />)}
        </div>
  
      </div>
      )
    }
  }