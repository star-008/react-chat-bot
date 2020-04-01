import React, { Component } from "react";
import "./index.css";
const negative_img = require("../../../../assets/images/negative.svg");
class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  render() {
    const { focused } = this.state;
    const { message, avatar, removeChat, user_avatar } = this.props;
    return (
      <div
        className={message.type === "left" ? "message-left" : "message-right"}
        onMouseEnter={() => {
          this.setState({ focused: true });
        }}
        onMouseLeave={() => {
          this.setState({ focused: false });
        }}
      >
        {message.type === "left" && (
          <img
            className="avatar"
            src={avatar}
            width="30"
            height="30"
            alt="user"
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {!message.content && <div className="bubble">{message.message}</div>}
          {message.content && (
            <div className="image">
              <img
                src={message.message}
                width="150px"
                height="150px"
                alt="img"
                style={{ borderRadius: 20 }}
              />
            </div>
          )}
          {focused && (
            <button onClick={removeChat}>
              <img
                className="avatar"
                src={negative_img}
                width="20"
                height="20"
                alt="user"
              />
            </button>
          )}
        </div>
        {message.type === "right" && (
          <img
            className="avatar"
            src={user_avatar}
            width="30"
            height="30"
            alt="user"
          />
        )}
      </div>
    );
  }
}
export default MessageItem;
