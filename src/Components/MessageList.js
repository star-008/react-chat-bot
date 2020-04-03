import React, { Component } from "react";
import { TransitionGroup } from "react-transition-group";
import { animateScroll } from "react-scroll";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import Firebase from "../firebasehelper";
import ErrorModal from "./ErrorModal";
import {
  getBotMessageGroup,
  getBetweenTimeoutValue,
  getTimeoutValue,
  getInputTimeoutValue,
  addBotMessageGroup,
  addBotMessages
} from "../Utils/botMessages";
import {
  getUserMessage,
  addUserMessage,
  addUserMessages
} from "../Utils/userMessages";
import {
  botMessages,
  userMessages,
  registered_botMessages,
  registered_userMessages,
  registration_botMessages,
  registration_userMessages
} from "../Constants/messages";
import { postMessage } from "../Utils/middleware";
import { getTicketNumber, ticket_create_SMS } from "../functions/Auth";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.messages = [
      {
        type: "user",
        message: "Hello"
      }
    ];
    this.state = {
      showInput: false,
      messages: [],
      name: "",
      isIphoneX: true,
      brand: "bolt",
      modalIsOpen: false,
      uid: props.uid,
      profile: props.profile,
      is_member: false,
      showTravel: false,
      already_existing: false,
      super_admins: []
    };
  }

  componentDidMount() {
    const { logo, restart, uid, profile } = this.props;
    this.setState({ brand: logo });
    console.log("restart in componentDid", restart);
    console.log("profile", profile);
    if (profile) {
      this.setState({ uid: uid, profile: profile });
      this.login();
    } else {
      console.log("show LIst");

      this.getBotMessageGroup();
    }
  }
  componentDidUpdate(prevProps) {
    const { restart } = this.props;
    // console.log("restart", restart);
    // if (restart) this.getBotMessageGroup();
  }
  login = () => {
    const { logIn, logo } = this.props;
    const { profile, uid } = this.state;
    logIn(profile, uid);
    //setTimeout(() => logIn(profile, uid), 4000);
  };
  getBotMessageGroup = () => {
    this.setState({
      showInput: false
    });
    let messageGroup = getBotMessageGroup();
    console.log("messageGroup", messageGroup);
    if (!messageGroup) {
      addBotMessages([
        [
          {
            type: "bot",
            message: "Hello, are you a member?"
          }
        ]
      ]);
      addUserMessages([
        {
          type: "user",
          inputType: "toggleButton",
          options: [
            {
              text: "No, I'd like to register for a 30 day trial",
              value: "No"
            },
            { text: "Yes", value: "Yes" }
          ],
          key: "is_member"
        }
      ]);
      messageGroup = getBotMessageGroup();
    }
    if (messageGroup) {
      messageGroup.forEach((message, index) => {
        const timeoutValue =
          getTimeoutValue() + (index ? index * getBetweenTimeoutValue() : 0);
        setTimeout(() => {
          this.setMessageInState(message);
          this.scrollToBottom();
          if (index === messageGroup.length - 1) this.toggleUserInput(true);
        }, timeoutValue);
      });
    }
  };

  scrollToBottom(delay = 0) {
    if (delay) {
      setTimeout(() => {
        animateScroll.scrollToBottom({
          duration: 500,
          smooth: "easeInOutQuad"
        });
      }, delay);
    } else {
      animateScroll.scrollToBottom({
        duration: 500,
        smooth: "easeInOutQuad"
      });
    }
  }

  setMessages() {
    const { logo, icon } = this.props;
    const { messages } = this.state;
    return messages.map((message, i) => {
      const firstChild = i !== 0 && messages[i - 1].type !== message.type;
      return (
        <MessageItem
          message={message}
          firstChild={firstChild}
          key={i}
          timeoutValue={getTimeoutValue(message.message)}
          logo={logo}
          icon={icon}
        />
      );
    });
  }

  toggleUserInput(timeout) {
    if (!this.state.showInput) this.scrollToBottom(500);
    const { userMessage } = this.state;
    const showInput = !this.state.showInput;
    if (timeout) {
      setTimeout(() => {
        if (!this.state.showInput) this.scrollToBottom(500);
        this.setState({
          showInput,
          userMessage: showInput ? getUserMessage() : userMessage
        });
      }, getInputTimeoutValue());
    } else {
      this.setState({
        showInput,
        userMessage: showInput ? getUserMessage() : userMessage
      });
    }
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }
  addMessage = message => {
    const { brand, uid, profile } = this.state;
    if (message.inputType === "input" && message.key === "firstname") {
      setTimeout(() => {
        this.scrollToBottom();
        let firstname = message.message;
        this.setMessageInState({
          type: "bot",
          message: `Great, thanks ${firstname}. `
        });
        this.getBotMessageGroup();
      }, getBetweenTimeoutValue());
    } else if (message.key === "is_member") {
      if (message.message === "Yes") {
        this.setState({ is_member: true });
        addBotMessages(registered_botMessages);
        addUserMessages(registered_userMessages);
      } else {
        addBotMessages(registration_botMessages);
        addUserMessages(registration_userMessages);
      }
      this.getBotMessageGroup();
    } else if (message.key === "wrong_sms") {
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms"
      });
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone"
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "Please confirm the sms code received."
        }
      ]);
      addBotMessageGroup([
        {
          type: "bot",
          message: `SMS Code is not matching. Try again.`
        }
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "no_received") {
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms"
      });
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone"
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "Please confirm the sms code received."
        }
      ]);
      addBotMessageGroup([
        {
          type: "bot",
          message: `Try again.`
        }
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "sms") {
      let phone = message.phone;
      let profile = message.profile;
      let is_member = message.is_member;
      if (is_member) {
        Firebase.getProfile(phone, brand).then(res => {
          if (res) {
            localStorage.setItem("uid", res.id);
            this.setState({ uid: res.id });
            this.setState({ profile: res.data() });
            this.login();
          } else
            this.setState({
              modalIsOpen: true,
              caption: "Error",
              content: `Your phone number is not existing in ${brand}!`
            });
        });
      } else {
        const { logIn } = this.props;
        this.setState({ profile, phone });
        console.log("profile before signup", profile);
        let new_profile = {
          dob: profile.dob,
          firstname: profile.firstname,
          phonenumber: profile.phonenumber
        };
        this.signup(new_profile)
          .then(res => {
            if (res) {
              const uid = res.id;
              this.setState({ uid: uid });
              logIn(new_profile, uid);
            } else {
              this.setState({
                modalIsOpen: true,
                already_existing: true,
                caption: "Error",
                content: `This phone number is registered to a member, I will take you to the members area.`
              });
            }
          })
          .catch(err => {
            this.setState({
              modalIsOpen: true,
              caption: "Error",
              content: err
            });
          });
      }
    } else {
      if (!message.finish) {
        setTimeout(() => {
          this.getBotMessageGroup();
        }, 1000);
      }
    }

    this.setMessageInState(message);
    this.toggleUserInput();
  };
  signup = profile => {
    console.log("profile in MessageList", profile);
    const { brand } = this.state;
    console.log("brand", brand);
    return Firebase.signup(profile, brand);
  };
  goBack = () => {
    // const { uid, profile } = this.props;
    // this.setState({ uid: uid, profile: profile });
    this.restart();
    this.getBotMessageGroup();
  };
  closeModal = () => {
    const { already_existing, phone, brand } = this.state;
    const { logIn } = this.props;
    if (already_existing) {
      Firebase.getProfile(phone, brand).then(res => {
        if (res) {
          localStorage.setItem("uid", res.id);
          this.setState({ uid: res.id });
          this.setState({ profile: res.data() });
          let profile = res.data();
          let uid = res.id;
          logIn(profile, uid);
        }
      });
    }
    this.setState({ modalIsOpen: false });
  };
  render() {
    const { logo, tier_data, uid } = this.props;
    const {
      showInput,
      userMessage,
      isIphoneX,
      modalIsOpen,
      caption,
      content,
      is_member,
      profile
    } = this.state;
    return (
      <div className="message-list-wrapper">
        {this.setMessages()}
        <div component="div" className="message-input-container">
          {showInput ? (
            <MessageInput
              message={userMessage}
              addMessage={this.addMessage}
              isIphoneX={isIphoneX}
              logo={logo}
              is_member={is_member}
              tier_data={tier_data}
              onRestart={this.goBack}
              profile={profile}
              uid={uid}
            />
          ) : null}
        </div>
        <ErrorModal
          caption={caption}
          content={content}
          closeModal={this.closeModal}
          modalIsOpen={modalIsOpen}
        />
      </div>
    );
  }
}

export default MessageList;
