import React, { Component, Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { animateScroll } from "react-scroll";
import Loader from "../Loader";

const landlord_img = require("../../images/livechat/landlord_logo.png");
const contractor_img = require("../../images/livechat/contractor_logo.png");
class BubbleText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: props.loaded,
      user_img: require("../../images/livechat/user.png")
    };
  }

  componentDidMount() {
    const { logo } = this.props;
    this.setState({ loaded: this.props.loaded });
  }
  getImageByType(type) {
    const { icon } = this.props;
    switch (type) {
      case "agency":
        return icon;
      case "landlord":
        return landlord_img;
      case "contractor":
        return contractor_img;
      default:
        return icon;
    }
  }
  render() {
    const { logo, icon } = this.props;
    let { type, message } = this.props.message;
    const { loaded, user_img } = this.state;
    const icon_type = type;
    if (type === "agency" || type === "landlord" || type === "contractor")
      type = "bot";
    return (
      <div
        style={
          type === "bot"
            ? {
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginBottom: 16
              }
            : { display: "flex", alignSelf: "flex-end", maxWidth: "100%" }
        }
      >
        {type === "bot" && (
          <img
            className="avatar"
            src={this.getImageByType(icon_type)}
            style={{ width: 40, height: 40 }}
            alt="concierge"
          />
        )}

        <div
          className={`message-item-wrapper ${
            loaded ? "loaded" : ""
          } ${type} firstChild`}
        >
          <Loader />
          <div className={`message ${logo === "bolt" ? "" : "notbolt"}`}>
            {ReactHtmlParser(message)}
          </div>
        </div>
        {type === "user" && (
          <img
            className="avatar"
            src={user_img}
            style={{ width: 40, height: 40 }}
            alt="concierge"
          />
        )}
      </div>
    );
  }
}

export default BubbleText;
