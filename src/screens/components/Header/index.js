import React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import burgerImg from "../../../images/header/burger.png";
import "./index.css";
import default_logo from  "../../../assets/logo/1.png";
 
// const default_logo = "../../../assets/logo/2.png";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: props.profile,
      brand: props.brand,
      menuVisible: false
    };
    this.outOfMenu = React.createRef();
  }
  toggleMenu = () => {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  };
  click = () => {
    this.setState({ menuVisible: false });
  };
  onBl = () => {
    console.log("blur");
  };
  clickul = () => {
    this.setState({ menuVisible: false });
  };
  //  start of when click the outsite of menu
  handleClickOutSide() {
    this.setState({ menuVisible: false });
  }  
  handleClick = (e) => {
    if (!this.outOfMenu.current.contains(e.target)) {
      this.handleClickOutSide();
    } else {
      return;
    }
  };
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, true);
  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, true);
  };
  // end of 
  render() {
    const { profile, brand, menuVisible } = this.state;
    const { signOut } = this.props;
    let username = "";
    let logo = "";
    if (profile) {
      username = profile.firstname;
      logo = brand.logo;
    }
    return (
      <header id="page-header" >
        <div className="content-header">
          <div className="heading" >
            <button
            className="header-logo"
              style={{
                // backgroundImage: logo ? `url(${logo})` : `url(${default_logo})`,
                backgroundImage: `url(${default_logo})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundColor: "transparent",
                border: "none",

                cursor: "pointer",
                width: 180,
                height: 60
              }}
            >
              {/* <img src={logo ? logo : default_logo} height="60px" alt="logo" /> */}
            </button>
            <ul
              className={menuVisible ? "show" : "hide"}
              onClick={this.clickul}
              onBlurCapture={this.onBl}
              ref={this.outOfMenu}
            >
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/wallet"
                  }}
                  className="nav-main-link"
                >
                  <i className="nav-main-link-icon si si-wallet" />
                  Wallet
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/perks"
                  }}
                  className="nav-main-link"
                >
                  <i className="nav-main-link-icon si si-trophy" />
                  <span className="nav-main-link-name">Perks</span>
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/feeds"
                  }}
                  className="nav-main-link"
                >
                  <i className="nav-main-link-icon si si-cup" />
                  <span className="nav-main-link-name">Feeds</span>
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/messages"
                  }}
                  className="nav-main-link"
                >
                  <i className="nav-main-link-icon si si-users" />
                  <span className="nav-main-link-name">Community</span>
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/polls"
                  }}
                  className="nav-main-link"
                >
                  <i className="nav-main-link-icon si si-tag" />
                  <span className="nav-main-link-name">Polls</span>
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/shop"
                  }}
                  className="nav-main-link"
                >
                  <i className="nav-main-link-icon si si-basket" />
                  <span className="nav-main-link-name">Shop</span>
                </NavLink>
              </li>
            </ul>
            <button
              className={`burger ${menuVisible ? "hide" : "show"}`}
              onClick={() => {this.toggleMenu(); }}
            >
              <img src={burgerImg} width="30" alt="burger" />
            </button>
          </div>
          <div className="second_menu">
            <div className="dropdown d-inline-block">
              <button
                type="button"
                className="btn top-btn"
                id="page-header-notifications-dropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fas fa-user" />
                <span className="badge  badge-pill">{username}</span>
              </button>
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0"
                aria-labelledby="page-header-notifications-dropdown"
              >
                <div className="p-2 border-top">
                  <button
                    className="btn btn-light btn-block text-center"
                    type="button"
                    data-toggle="modal"
                    data-target="#profile_modal"
                  >
                    <i className="fa fa-user" />
                    &nbsp;&nbsp;&nbsp; MY PROFILE
                  </button>
                  <button
                    className="btn btn-light btn-block text-center"
                    type="button"
                    data-toggle="modal"
                    data-target="#timeline_modal"
                  >
                    <i className="fa fa-calendar-times" />
                    &nbsp;&nbsp;&nbsp; MY TIMELINE
                  </button>
                  <button
                    className="btn btn-light btn-block text-center"
                    type="button"
                    data-toggle="modal"
                    data-target="#subscription_modal"
                  >
                    <i className="fa fa-file-invoice-dollar" />
                    &nbsp;&nbsp;&nbsp; MY SUBSCRIPTIONS
                  </button>
                  <button
                    className="btn btn-light btn-block text-center"
                    onClick={signOut}
                  >
                    <i className="fas fa-sign-out-alt" />
                    &nbsp;&nbsp;&nbsp;Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
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
export default connect(mapStateToProps, mapDispatchToProps)(Header);