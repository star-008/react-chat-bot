import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import "./index.css";
import Firebase from "../../firebasehelper";
import Header from "../components/Header";
import FilterTab from "./components/FilterTab";
import SwitchBar from "./components/SwitchBar";
import { removeAll } from "../../redux/actions";
import ProfileModal from "../../Components/ProfileModal";
import SubscriptionModal from "../../Components/SubscriptionModal";
import TimelineModal from "../../Components/TimelineModal";

const filter_array = array => {
  let arr = [];
  array.forEach(item => {
    arr[item.id] = item;
  });
  return arr;
};

class Perks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      top_10perks: [],
      loading: true,
      tag: "Top 10",
      deactive_arr: [],
      business_offers: [],
      personal_offers: [],
      is_business_offers_need: false,
      offer_type: "personal"
    };
  }
  componentDidMount() {
    const { uid, profile, brand } = this.props;
    const { personal_offers, business_offers, is_business_offers_need } = brand;
    console.log("personal_offers", personal_offers);
    if (personal_offers) this.setState({ personal_offers });
    if (business_offers) this.setState({ business_offers });
    this.setState({
      is_business_offers_need: is_business_offers_need
        ? is_business_offers_need
        : false
    });
    if (!uid) this.props.history.push("/");
    Firebase.getTop10Perks(res => {
      this.setState({ top_10perks: res });
      console.log("top_10perks", res);
    });
    Firebase.getAllOffers(res => {
      this.setState({ loading: false });
      let offers = filter_array(res);
      this.setState({ offers });
    });
    Firebase.getAllDeactiveOffers(res => {
      let deactive_arr = [];
      if (res) deactive_arr = res;
      this.setState({ deactive_arr });
    });
  }
  switchOffer = offer_type => {
    console.log("offer", offer_type);
    this.setState({ offer_type });
  };
  filter_View = tag => {
    if (tag === "all") this.setState({ tag: "" });
    else this.setState({ tag });
  };
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  showPersonalOffer = () => {
    const {
      offers,
      personal_offers,
      loading,
      tag,
      deactive_arr,
      top_10perks
    } = this.state;
    console.log("personal_offers", personal_offers);
    return (
      <div className="content">
        {loading && <i className="fa fa-4x fa-sync fa-spin text-muted" />}
        {!loading && <FilterTab filter_View={this.filter_View} tag={tag} />}
        {!loading && (
          <div className="tiles">
            {tag !== "Top 10" &&
              offers.map((item, index) => {
                if (item.category.includes(tag) && !deactive_arr[item.id])
                  return (
                    <div
                      id={index}
                      className="deal"
                      style={{
                        backgroundImage: `url(${item.dealHeroImage})`
                      }}
                    >
                      <div className="deal-caption">
                        <b>{item.name}</b>
                        <span>{item.membershipBenefit}</span>
                      </div>
                      <div
                        className="deal-logo"
                        style={{ backgroundImage: `url(${item.logo})` }}
                      ></div>
                    </div>
                  );
              })}
            {tag === "Top 10" &&
              top_10perks.map((item, index) => {
                return (
                  <div
                    id={index}
                    className="deal"
                    style={{
                      backgroundImage: `url(${item.dealHeroImage})`
                    }}
                  >
                    <div className="deal-caption">
                      <b>{item.name}</b>
                      <span className="top10">
                        {ReactHtmlParser(item.membershipBenefit)}
                      </span>
                    </div>
                    <div
                      className="deal-logo"
                      style={{ backgroundImage: `url(${item.logo})` }}
                    ></div>
                  </div>
                );
              })}
            {personal_offers.map((item, index) => {
              if (item.category.includes(tag))
                return (
                  <div
                    id={index}
                    className="deal"
                    style={{
                      backgroundImage: `url(${item.dealHeroImage})`
                    }}
                  >
                    <div className="deal-caption">
                      <b>{item.name}</b>
                      <span>{item.membershipBenefit}</span>
                    </div>
                    <div
                      className="deal-logo"
                      style={{ backgroundImage: `url(${item.logo})` }}
                    ></div>
                  </div>
                );
            })}
          </div>
        )}
      </div>
    );
  };
  showBusinessOffer = () => {
    const { business_offers, loading } = this.state;
    return (
      <div className="content">
        {loading && <i className="fa fa-4x fa-sync fa-spin text-muted" />}
        {!loading && (
          <div className="tiles">
            {business_offers.map((item, index) => {
              return (
                <div
                  id={index}
                  className="deal"
                  style={{
                    backgroundImage: `url(${item.dealHeroImage})`
                  }}
                >
                  <div className="deal-caption">
                    <b>{item.name}</b>
                    <span>{item.membershipBenefit}</span>
                  </div>
                  <div
                    className="deal-logo"
                    style={{ backgroundImage: `url(${item.logo})` }}
                  ></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  render() {
    const { is_business_offers_need, offer_type } = this.state;
    return (
      <div id="page-container">
        <Header signOut={this.signOut} screen="perks" />
        <main id="main-container">
          {is_business_offers_need && (
            <SwitchBar switchOffer={this.switchOffer} offer_type={offer_type} />
          )}
          {offer_type === "personal" && this.showPersonalOffer()}
          {offer_type === "business" && this.showBusinessOffer()}
        </main>
        <ProfileModal />
        <SubscriptionModal />
        <TimelineModal />
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    profile: state.profile,
    brand: state.brand
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Perks));
