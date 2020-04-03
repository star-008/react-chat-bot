import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import "./index.css";
import "../../Styles/Common.css";
import Firebase from "../../firebasehelper";
import Header from "../components/Header";
import ProfileModal from "../../Components/ProfileModal";
import SubscriptionModal from "../../Components/SubscriptionModal";
import TimelineModal from "../../Components/TimelineModal";
import { removeAll, saveProfile } from "../../redux/actions";
import { add_NimdaUser, add_NimdaCard } from "../../functions/Auth";
import { link } from "fs";
const eco_coin_img = require("../../images/wallet/eco_coin.png");
const live_coin_img = require("../../images/wallet/live_coin.png");
const pending_coin_img = require("../../images/wallet/pending_coin.png");
const social_coin_img = require("../../images/wallet/social_coin.png");
const shopping_img = require("../../images/wallet/shopping-bags.png");
const credit_card_img = require("../../images/wallet/credit-card.png");
class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      profile: props.profile ? props.profile : []
    };
    window.fidelCallback = this.onFidel.bind(this);
  }
  componentDidMount() {
    const { uid } = this.props;
    if (!uid) this.props.history.push("/");
    console.log("props", this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { profile } = nextProps;
    console.log("updated profile", profile);
    this.setState({ profile });
  }
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  onSpendTokens = () => {
    this.props.history.push("/perks");
  };
  onFidel(error, card) {
    console.log("error", error);
    console.log("card is linked", card);
    if (!error) {
      this.linkCard(card);
    }
  }
  linkCard = async fidel => {
    const { brand, uid } = this.props;
    const { profile } = this.state;
    const { firstname, dob, phonenumber, fidels } = profile;
    const { name } = brand;
    this.setState({ adding: true });
    let new_fidels = [];
    if (fidels) new_fidels = fidels;
    new_fidels.push(fidel);
    if (profile.nimda_id) {
      let result = await add_NimdaCard(profile.nimda_id, fidel.id);
      console.log("card result", result);
      Firebase.updateUserData(name, uid, { fidels: new_fidels }).then(res => {
        this.props.dispatch(saveProfile(res));
        this.setState({ adding: false });
      });
    } else {
      let user_result = await add_NimdaUser(dob, firstname, phonenumber);
      console.log("add User result", user_result);
      let nimda_id = user_result.data[0]["bolt-user-id"];
      let card_result = await add_NimdaCard(nimda_id, fidel.id);
      console.log("add Card result", card_result);
      console.log("before update user data", name, uid, nimda_id, new_fidels);
      Firebase.updateUserData(name, uid, {
        nimda_id: nimda_id,
        fidels: new_fidels
      }).then(res => {
        this.props.dispatch(saveProfile(res));
        this.setState({ adding: false });
      });
    }
  };
  showListCards = () => {
    const { profile } = this.state;
    const { fidels } = profile;
    if (fidels) {
      return fidels.map(item => {
        console.log("fidels", fidels);
        return (
          <p>
            {item.type}&nbsp;&nbsp;&nbsp;&nbsp;{item.firstNumbers}***
            {item.lastNumbers}
          </p>
        );
      });
    }
  };
  
  render() {
    const { adding, profile } = this.state;
    let tokens = 0;
    if (profile) {
      if (profile.tokens) tokens = profile.tokens;
    }
    return (
      <div id="page-container">
        <Header signOut={this.signOut} screen="wallet" />
        <main id="main-container">
          <div className="row_view" style={{ flexDirection: "column", alignItems: "center", padding: "0 5px" }}>
            <p className="font_bold_title text_center mobile_none">helping you and others live your best life, simply because you deserve it</p>
            <p className="font_bold_title text_center desktop_none">live your best life</p>
            <p className="text_center desktop_none">Credits built up over the
                month, earned from<br></br>
                community engagements and from shopping<br></br>
                  with our retail friends.
            </p>
          </div>
          <div className="row_view">
            <div className="coin_div pending_coin_div">
              <p>Pending Coins</p>
              <img className="coin_img" src={pending_coin_img} alt="coin" />
              <p>0</p>
            </div>
            <div className="coin_div live_coin_div">
              <p>Live Coins</p>
              <img className="coin_img" src={live_coin_img} alt="coin" />
              <p>{tokens}</p>
            </div>
            {adding && (
            <div className="row_view">
              <i className="fa fa-4x fa-sync fa-spin text-muted" />
            </div>
            )}
            {!adding && (
              <div className="row_view desktop_none">
                <button className="btn" onClick={() => window.Fidel.openForm()}>
                  <p className="mobile_link_size">Link my cards</p>
                  <img src={credit_card_img} width="20" alt="card" />
                </button>
                <button className="btn" onClick={this.onSpendTokens}>
                  <p className="mobile_link_size">Spend your tokens</p>
                  <img src={shopping_img} width="20" alt="shop" />
                </button>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: "1rem" }}>
             <div style={{ paddingRight: "9%", marginLeft: "-9%" }}>
             <p className="text_center desktop_none" style={{ padding: "0 1rem" }}>We fund a 10% donation on top of your<br className="mobile_none"></br>
                monthly token earnings to a charitable cause,<br className="mobile_none"></br>
                 as voted by you.
            </p>
             </div>
              <div className="coin_div eco_coin_div" style={{ clipPath: "polygon(0% 0%, 80% 0%, 102% 100%, 0% 360%)", minWidth: "50%" }}>
                <p>Eco Coins</p>
                <img className="coin_img" src={eco_coin_img} alt="coin" />
                <p>9</p>
            </div>
            </div>
            <div className="coin_div coin_div_mobile_none">
              <p>Social Coins</p>
              <img className="coin_img" src={social_coin_img} alt="coin" />
              <p>0</p>
            </div>
          </div>
          <div className="row_view mobile_none">
            <div className="coin_div">
              <p className="font_bold text_center">Credits built up over the<br></br>
                  month, earned from<br></br>
                  community engagements<br></br>
                  and from shopping with<br></br>
                  our retail friends.
              </p>
            </div>
            <div className="coin_div">
              <p className="font_bold text_center">Available to spend on<br></br>
                  retail purchases and in<br></br>
                  the shop. Tokens are<br></br>
                  made available very last<br></br>
                  Friday of the month.
              </p>
            </div>
            <div className="coin_div">
              <p className="font_bold text_center">We fund a 10% donation<br></br>
                  on top of your monthly<br></br>
                  token earnings<br></br>
                  to an ecological cause,<br></br>
                  voted by you.
              </p>
            </div>
            <div className="coin_div">
              <p className="font_bold text_center">We fund a 10% donation<br></br>
                  on top of your monthly<br></br>
                  token earnings<br></br>
                  to an ecological cause,<br></br>
                  voted by you.
              </p>
            </div>
          </div>
          {adding && (
            <div className="row_view mobile_none">
              <i className="fa fa-4x fa-sync fa-spin text-muted" />
            </div>
          )}
          {!adding && (
            <div className="row_view mobile_none">
              <button className="btn" onClick={this.onSpendTokens}>
                <p>Spend your tokens</p>
                <img src={shopping_img} width="20" alt="shop" />
              </button>
              <button className="btn" onClick={() => window.Fidel.openForm()}>
                <p>Link my cards</p>
                <img src={credit_card_img} width="20" alt="card" />
              </button>
            </div>
          )}
          <div className="row_view">{this.showListCards()}</div>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet));
