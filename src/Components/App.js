import React, { Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import { FadeLoader } from "react-spinners";
import Shop from "../screens/Shop";
import Feeds from "../screens/Feeds";
import Perks from "../screens/Perks";
import Message from "../screens/Message";
import Wallet from "../screens/Wallet";
import Polls from "../screens/Polls";
import Screen from "./Screen";
import { saveUID, saveProfile, saveBrand } from "../redux/actions";
import { css } from "@emotion/core";
import Firebase from "../firebasehelper";

const isJSON = str => {
  if (
    /^[\],:{}\s]*$/.test(
      str
        .replace(/\\["\\\/bfnrtu]/g, "@")
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          "]"
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
    )
  ) {
    return true;
  } else {
    return false;
  }
};

const override = css`
  position: absolute;
  top: 48%;
  left: 48%;
  radius: 2px;
  height: 15px;
  width: 5px;
  display: block;
  margin: 0 auto;
  border-color: grey;
`;
const bolt_logo =
  "https://firebasestorage.googleapis.com/v0/b/boltconcierge-2f0f9.appspot.com/o/brand_logo%2Fbolt.png?alt=media&token=89a7b04c-a670-48dd-8bd7-8565181a2bd4";
const bolt_icon =
  "https://firebasestorage.googleapis.com/v0/b/aiconcierge.appspot.com/o/icons%2Fagency_logo.png?alt=media&token=3b61781e-1f2b-4136-b26d-2edbed2a6034";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      brands: [],
      fromMobile: false
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    Firebase.getAllBrands(res => {
      this.setState({ loading: false, brands: res });
      console.log("brands", res);
    });
  }
  render() {
    const { loading, brands, fromMobile } = this.state;
    return (
      <Fragment>
        <FadeLoader
          css={override}
          sizeUnit={"px"}
          size={100}
          loading={loading}
        />

        <Switch>
          <Route path="/wallet" render={props => <Wallet {...props} />} />
          <Route path="/feeds" render={props => <Feeds {...props} />} />
          <Route path="/shop" render={props => <Shop {...props} />} />
          <Route path="/perks" render={props => <Perks {...props} />} />
          <Route path="/messages" render={props => <Message {...props} />} />
          <Route path="/polls" render={props => <Polls {...props} />} />
          {!loading && (
            <Route
              exact
              path="/"
              render={props => (
                <Screen
                  {...props}
                  name="Bolt"
                  logo={bolt_logo}
                  icon={bolt_icon}
                />
              )}
            />
          )}
          {!loading &&
            brands.map((item, index) => {
              const { logo, name, icon } = item;
              let brand = name.replace(/\s/g, "");
              let path = "/" + brand;
              return (
                <Route
                  path={path}
                  key={index}
                  render={props => (
                    <Screen
                      {...props}
                      name={name}
                      logo={logo}
                      icon={icon}
                      fromMobile={fromMobile}
                    />
                  )}
                />
              );
            })}
        </Switch>
      </Fragment>
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
    uid: state.uid
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
