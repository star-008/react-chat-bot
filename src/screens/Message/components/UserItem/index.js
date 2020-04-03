import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";


import "./index.css";
const avatar = require("../../../../images/community/avatar.png");

class UserItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content,
      url: props.url,
      selected: props.selected
    };
  }
  componentDidMount() {
    const { selected } = this.props;
    this.setState({ selected: selected });
  }
  componentWillReceiveProps(prevProps) {
    this.setState({ selected: prevProps.selected });
  }
  render() {
    const { url, dob, username, onSelect, selected } = this.props;
    let birthday = dob.split("/");
    let yy = birthday[2];
    let current_year = new Date().getFullYear();
    let age = current_year - parseInt(yy);

    return (
      <div className="user_item" style={{}} onClick={onSelect}>
        <img
          src={url ? url : avatar}
          width="60"
          height="60"
          style={{ borderRadius: '50%', width: 60, height: 60 }}
          alt="avatar"
        />
        <div className="user_item_content" style={{'width':'100%'}}>
          <p className="username">{username}</p>
          <p className="age">Age:{age}</p>
        </div>
        <div className="button_area">
          <div>
            <button className="btn_green">Chat</button>
          </div>
          <div style={{float: 'right'}}>
            <button className="btn_yellow">Profile</button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserItem;
