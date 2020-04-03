import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./index.css";
import UserItem from "./components/UserItem";
import MessageItem from "./components/MessageItem";
import Header from "../components/Header";
import { animateScroll } from "react-scroll";
import ScrollToBottom from "react-scroll-to-bottom";
import Firebase from "../../firebasehelper";
import {
  saveProfile,
  saveUID,
  removeAll,
  saveUsers
} from "../../redux/actions";
import ProfileModal from "../../Components/ProfileModal";
import SubscriptionModal from "../../Components/SubscriptionModal";
import TimelineModal from "../../Components/TimelineModal";
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      input_msg: "",
      chats: [],
      userList: [],
      filtered_array: [],
      current_chatId: "",
      avatar: "",
      avatar_caption: "",
      search_txt: "",
      selected: ""
    };
  }
  componentDidMount() {
    const { uid, profile, brand, posts } = this.props;
    if (!uid) this.props.history.push("/");
    console.log("uid,brand", uid, brand);
    let brand_name = brand.name;
    if (brand_name && brand_name !== "Bolt") {
      this.unsubscribeUsers = Firebase.firestore()
        .collection(brand_name)
        .doc("data")
        .collection("user")
        .onSnapshot(snapshot => {
          let users = [];
          if (snapshot.size) {
            snapshot.forEach(doc => {
              let user = doc.data();
              user.id = doc.id;
              if (user.id !== uid) users.push(user);
            });
            console.log("users", users);
            this.setState({ userList: users });
            this.setState({ filtered_array: users });
          }
          this.props.dispatch(saveUsers(users));
        });
    } else if (brand_name && brand_name === "Bolt") {
      this.unsubscribeUsers = Firebase.firestore()
        .collection("user")
        .onSnapshot(snapshot => {
          let users = [];
          if (snapshot.size) {
            snapshot.forEach(doc => {
              let user = doc.data();
              user.id = doc.id;
              if (user.id !== uid) users.push(user);
            });
            console.log("users", users);
            this.setState({ userList: users });
            this.setState({ filtered_array: users });
          }
          this.props.dispatch(saveUsers(users));
        });
    }
    //Firebase.getCommunityChats()
    //let uid = this.props.uid;
    //const chats = this.props.chats;
    // this.setState({ chats: chats });
    // let list = chats.map(async item => {
    //   const uid = item.userId;
    //   return Firebase.getUserItem(
    //     uid,
    //     item.message.content,
    //     item.message.timestamp,
    //     item.chatId
    //   );
    // });
    // Promise.all(list).then(result => {
    //   console.log("result", result);
    //   this.setState({ userList: result });
    //   this.setState({ filtered_array: result });
    // });
  }
  componentWillReceiveProps(nextProps) {
    // const chats = nextProps.chats;
    // this.setState({ chats: chats });
    // let list = chats.map(async item => {
    //   const uid = item.userId;
    //   return Firebase.getUserItem(
    //     uid,
    //     item.message.content,
    //     item.message.timestamp,
    //     item.chatId
    //   );
    // });
    // Promise.all(list).then(result => {
    //   console.log("result", result);
    //   this.setState({ userList: result });
    // });
  }
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  getDateString = timestamp => {
    var ts = new Date();
    ts.setTime(timestamp);
    return ts.toDateString();
  };
  setMessages() {
    const { messages, avatar, profile_photo_url } = this.state;
    return messages.map((message, i) => {
      return (
        <MessageItem
          user_avatar={profile_photo_url}
          message={message}
          avatar={avatar}
          removeChat={() => this.removeChat(message)}
        />
      );
    });
  }
  onChangeText = e => {
    this.setState({ input_msg: e.target.value });
  };
  removeChat = message => {
    const { chatsId, timestamp } = message;
    const res = Firebase.removeChat(chatsId, timestamp);
  };
  onChangeSearch = e => {
    const value = e.target.value;
    const { userList } = this.state;
    let filtered_array = [];
    userList.map(item => {
      let firstname = item.firstname.toLowerCase();
      let partstr = value.toLowerCase();
      if (firstname.startsWith(partstr)) {
        filtered_array.push(item);
      }
    });
    if (value) {
      this.setState({ filtered_array: filtered_array });
    } else {
      this.setState({ filtered_array: userList });
    }
  };
  scrolltoBottom = () => {
    animateScroll.scrollToBottom({
      duration: 500,
      smooth: "easeInOutQuad"
    });
  };
  logout = () => {
    this.props.dispatch(saveProfile({}));
    this.props.dispatch(saveUID(""));
  };
  Send = () => {
    const { messages, input_msg, chatId } = this.state;
    const { uid } = this.props;
    const dt = new Date();
    let n = dt.getTime();
    Firebase.addChat(
      chatId,
      { content: input_msg, senderId: uid, timestamp: n },
      error => {
        if (error) {
          console.log(error);
        } else {
          let temp = messages;
          temp.push({ message: input_msg, type: "right" });
          this.setState({ messages: temp });
          this.setState({ input_msg: "" });
        }
      }
    );
  };
  selectUser = item => {
    const { chatId, profile_url, username, time } = item;
    const { uid } = this.props;
    let messages = [];
    // Firebase.getAllChat(chatId, res => {
    //   messages = Object.values(res).map(item => {
    //     if (item.content === "📷")
    //       return {
    //         chatsId: chatId,
    //         timestamp: item.timestamp,
    //         content: "image",
    //         message: item.imageUrl,
    //         type: item.senderId === uid ? "right" : "left"
    //       };
    //     else
    //       return {
    //         chatsId: chatId,
    //         timestamp: item.timestamp,
    //         message: item.content,
    //         type: item.senderId === uid ? "right" : "left"
    //       };
    //   });
    //   this.setState({ messages: messages });
    //   this.setState({ chatId: chatId });
    //   this.setState({ avatar: profile_url });
    //   this.setState({ avatar_caption: username });
    //   this.setState({ selected: username });
    //   this.setState({ time: time });
    //   console.log("profile_url", profile_url);
    //   console.log("messages", messages);
    // });
  };
  render() {
    const {
      input_msg,
      userList,
      avatar,
      avatar_caption,
      filtered_array,
      profile_photo_url,
      selected,
      time
    } = this.state;
    let uid = this.props.uid;
    if (!uid) return <Redirect to="/" />;
    return (
      <div
        id="page-container"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh"
        }}
      >
        <Header signOut={this.signOut} screen="messages" />
        <div className="main-div">
          <div className="companion-list block block-rounded block-bordered">
            <div className="search-div">
              <img
                src={require("../../assets/images/search.svg")}
                width="16"
                style={{ marginRight: -20, zIndex: 100 }}
                alt="search"
              />
              <input
                placeholder="Search"
                width="80%"
                className="search-box"
                name="search"
                onChange={this.onChangeSearch}
              />
            </div>
            <div className="user-list">
              {filtered_array.map((item, index) => {
                return (
                  <UserItem
                    key={index}
                    username={item.firstname}
                    dob={item.dob}
                    url={item.avatar_url}
                    onSelect={() => this.selectUser(item)}
                    selected={selected === item.username ? true : false}
                  />
                );
              })}
              {!userList.length && <p>Empty</p>}
            </div>
          </div>

          <div className="chat-board block block-rounded block-bordered">
            <div className="user-logo">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto"
                }}
              >
                {avatar && (
                  <img src={avatar} width="60" height="60" alt="user" />
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginLeft: 10,
                    height: 60
                  }}
                >
                  <p style={{ fontWeight: "600", fontSize: 20 }}>
                    {avatar_caption}
                  </p>
                  {time && (
                    <p style={{ color: "lightgrey" }}>
                      {this.getDateString(time)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="chat">
              <ScrollToBottom className="ROOT_CSS">
                {this.setMessages()}
              </ScrollToBottom>
              <div className="message-input">
                <textarea
                  name="message"
                  id="message"
                  cols="40"
                  rows="5"
                  onChange={this.onChangeText}
                  onKeyPress={e => {
                    if (e.charCode === 13) this.Send();
                  }}
                  value={input_msg}
                  placeholder="Write message..."
                />

                <button style={{ fontSize: 15 }} onClick={this.Send}>
                  Send
                </button>
              </div>
            </div> */}
          </div>
        </div>
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
  console.log(state);
  return {
    uid: state.uid,
    profile: state.profile,
    brand: state.brand
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Messages));
