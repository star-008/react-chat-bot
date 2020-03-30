import React, { Component } from "react";
import "./index.css";
const avatar_img = require("../../../../images/community/avatar.png");

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar_url: ""
    };
  }
  componentDidMount() {
    const { tenant } = this.props;
    console.log("tenant in TenantThumbnail", tenant);
  }
  componentWillReceiveProps(nextProps) {}
  render() {
    const { tenant, onClick } = this.props;
    const { avatar_url, dob } = tenant;
    let birthday = dob.split("/");
    let yy = birthday[2];
    let current_year = new Date().getFullYear();
    let age = current_year - parseInt(yy);
    return (
      <div className="avatar-thumb" onClick={onClick}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundImage: `url(${avatar_url ? avatar_url : avatar_img})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%"
          }}
        >
          <div className="caption-bar">
            <p className="name">{tenant.firstname}</p>
            <p className="name">{age}</p>
          </div>
        </div>
      </div>
    );
  }
}
export default Avatar;
