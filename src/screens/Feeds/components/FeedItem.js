import React, { Component } from "react";
import "./index.css";
class FeedItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { username, avatar_url, poster, content, title, time,index } = this.props;
    return (
      <div className="feed-container block block-rounded block-bordered " key={index}>
        <div className="avatar-section">
          <div className="avatar-img">
            <img
              src={
                avatar_url
                  ? avatar_url
                  : require("../../../images/community/avatar.png")
              }
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                resizeMode: "contain"
              }}
              alt="avatar"
            />
          </div>
          <div className="title_name-section">
            <p className="feed_title">{title}</p>
            <p className="feed_user">{username}</p>
          </div>
        </div>
        <p className="content_letter">{content}</p>
        <div
          style={{
            width: "100%",
            height: 500,
            backgroundImage: `url(${poster})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            marginTop: 10,
            paddingLeft: 20
          }}
        >
          <p
            style={{ fontFamily: "Gothic A1", fontWeight: "200", fontSize: 12 }}
          >
            Posted {time}
          </p>
        </div>
      </div>
    );
  }
}
export default FeedItem;
