import React from "react";
import "./index.css";
class SwitchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { switchOffer, offer_type } = this.props;
    return (
      <div className="filter_tab">
        <button
          className={`btn ${offer_type === "personal" ? "active" : ""}`}
          onClick={() => switchOffer("personal")}
        >
          Personal Offers
        </button>
        <button
          className={`btn ${offer_type === "business" ? "active" : ""}`}
          onClick={() => switchOffer("business")}
        >
          Business Offers
        </button>
      </div>
    );
  }
}

export default SwitchBar;
