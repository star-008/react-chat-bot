import React, { Component } from "react";
import { connect } from "react-redux";
import { FadeLoader } from "react-spinners";
import MessageList from "./MessageList";
import Firebase from "../firebasehelper";
import { saveUID, saveProfile, saveBrand, savePosts } from "../redux/actions";
import { loadScript } from "../functions/Auth";
import { css } from "@emotion/core";
const queryString = require("query-string");

const override = `
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
function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}
class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chat_started: false,
      restart: false,
      loading: false,
      background: "#fff",
      services_routing: [],
      tier_data: [],
      logged_in: false
    };
  }
  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      console.log("on route change");
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }
  onLoad = () => {
    console.log("loaded successfully");
  };
  callBack = (error, card) => {
    console.log("callback");
  };
  async componentDidMount() {
    const { name, logo, color, icon } = this.props;
    // const parsed = queryString.parse(this.props.location.search);
    // if (parsed.uid) {
    //   let res = await Firebase.getProfileByUID(parsed.uid, name);
    //   if (res)
    //     this.setState({
    //       profile: res,
    //       uid: parsed.uid,
    //       restart: true,
    //       loading: false
    //     });
    //   else alert("User is not existing.");
    // }
    // this.setState({ loading: false });

    let profile = localStorage.getItem("profile");
    let uid = localStorage.getItem("uid");
    let brand = localStorage.getItem("brand");
    console.log("profile in Screen", profile);
    if (uid) {
      profile = JSON.parse(profile);
      brand = JSON.parse(brand);
      this.props.dispatch(saveProfile(profile));
      this.props.dispatch(saveBrand(brand));
      this.props.dispatch(saveUID(uid));
      this.unsubscribePosts = Firebase.firestore()
        .collection(brand.name)
        .doc("data")
        .collection("post")
        .orderBy("timestamp", "desc")
        .onSnapshot(snapshot => {
          let posts = [];
          if (snapshot.size) {
            snapshot.forEach(doc => {
              posts.push(doc.data());
            });
            let promises = posts.map(async item => {
              const { timestamp, uid } = item;
              let user_data = await Firebase.getUserDatafromUID(
                brand.name,
                uid
              );
              console.log(user_data);
              item.time = toDateTime(timestamp.seconds).toLocaleString();
              item.avatar_url =
                user_data && user_data.avatar_url ? user_data.avatar_url : "";
              item.firstname = user_data && user_data.firstname;
              return item;
            });
            console.log(promises);

            Promise.all(promises).then(res => {
              console.log("final_posts, brand", res, brand.name);
              this.props.dispatch(savePosts(posts));
            });
          }
        });
      console.log("uid,profile,brand", uid, profile, brand);
      // loadScript(
      //   brand.name,
      //   "https://www.barclaycard.co.uk/content/dam/barclaycard/images/barclaycard-logo.png",
      //   "http://www.boltlabs.co.uk/boltappprivacy",
      //   this.onLoad
      // );
      // this.props.history.push("/wallet");
    } else {
      console.log("signed out!");
      this.setState({ restart: true });
    }
    document.title = name;
    let link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "icon";
    link.href = icon;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  logIn = async (profile, uid) => {
    const { name } = this.props;
    const { loading } = this.state;
    this.setState({ loading: true });
    let brand = await Firebase.getBrandDataByName(name);
    this.setState({ profile, uid, logged_in: true });
    this.unsubscribePosts = Firebase.firestore()
      .collection(name)
      .doc("data")
      .collection("post")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        let posts = [];
        if (snapshot.size) {
          snapshot.forEach(doc => {
            posts.push(doc.data());
          });
          let promises = posts.map(async item => {
            const { timestamp, uid } = item;
            let user_data = await Firebase.getUserDatafromUID(name, uid);
            item.time = toDateTime(timestamp.seconds).toLocaleString();
            if (user_data) {
              item.avatar_url = user_data.avatar_url
                ? user_data.avatar_url
                : "";
              item.firstname = user_data.firstname;
            }
            return item;
          });
          Promise.all(promises).then(res => {
            console.log("final_posts", res);
            this.props.dispatch(savePosts(posts));
          });
        }
      });
    this.props.dispatch(saveProfile(profile));
    this.props.dispatch(saveBrand(brand));
    this.props.dispatch(saveUID(uid));
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("brand", JSON.stringify(brand));
    localStorage.setItem("uid", uid);
    // loadScript(
    //   brand.name,
    //   "https://www.barclaycard.co.uk/content/dam/barclaycard/images/barclaycard-logo.png",
    //   "http://www.boltlabs.co.uk/boltappprivacy",
    //   this.onLoad
    // );
    if (!loading) this.props.history.push("/wallet");
    //setTimeout(() => this.props.history.push("/feeds"), 200);
  };
  render() {
    const {
      uid,
      profile,
      loading,
      background,
      logged_in,
      restart
    } = this.state;
    const { name, icon } = this.props;
    return (
      <div className="app-wrapper">
        {loading && (
          <FadeLoader
            css={override}
            sizeUnit={"px"}
            size={100}
            loading={loading}
          />
        )}
        {!loading && !logged_in && (
          <MessageList
            {...this.props}
            logo={name}
            icon={icon}
            uid={uid}
            restart={restart}
            profile={profile}
            logIn={this.logIn}
          />
        )}
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
    uid: state.uid
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Screen);
