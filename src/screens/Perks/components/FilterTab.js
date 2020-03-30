import React from "react";
import "./index.css";
const imageAll = require("../../../assets/images/chip.png");
const imageTop10 = require("../../../assets/images/sign.png");
const imageFood = require("../../../assets/images/dinner-table.png");
const imageBeauty = require("../../../assets/images/heart.png");
const imageFashion = require("../../../assets/images/armchair.png");
const imageHome = require("../../../assets/images/responsive.png");
const imageTech = require("../../../assets/images/ticket.png");
class FilterTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: []
    };
  }
  render() {
    const { filter_View } = this.props;
    return (
      <div className="filter_tab">
        <button className="btn imageStyle" onClick={() => filter_View("all")}>
          <img className="perkImage" src={imageAll}></img>
        </button>
        <button className="btn imageStyle" onClick={() => filter_View("Top 10")}>
          <img className="imageTopTen" src={imageTop10}></img>
        </button>
        <button className="btn imageStyle" onClick={() => filter_View("Food and Drink")}>
          <img className="perkImage" src={imageFood}></img>
        </button>
        <button className="btn imageStyle" onClick={() => filter_View("Beauty & Wellbeing")}>
          <img className="perkImage" src={imageBeauty}></img>
        </button>
        <button className="btn imageStyle" onClick={() => filter_View("Fashion")}>
          <img className="perkImage" src={imageFashion}></img>
        </button>
        <button className="btn imageStyle" onClick={() => filter_View("Home")}>
          <img className="perkImage" src={imageHome}></img>
        </button>
        <button className="btn imageStyle" onClick={() => filter_View("Tech")}>
          <img className="perkImage" src={imageTech}></img>
        </button>
      </div>
    );
  }
}

export default FilterTab;
