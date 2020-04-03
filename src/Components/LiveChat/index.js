import React, { Component } from "react";
import { TransitionGroup } from "react-transition-group";
import { animateScroll } from "react-scroll";
import MessageInput from "../../Components/LiveChat/MessageInput";
import BubbleText from "../../Components/LiveChat/BubbleText";
import Firebase from "../../firebasehelper";
var timer;
class LiveChat extends Component {
  state = {
    showInput: false,
    messages: [],
    name: "",
    isIphoneX: true
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: props.uid
    };
  }

  componentDidMount() {}

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
    console.log("messages", messages);
    return messages.map((message, i) => {
      return (
        <BubbleText
          message={message}
          key={i}
          logo={logo}
          loaded={true}
          icon={icon}
        />
      );
    });
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    let new_message = { type: message.type, message: message.message };
    messages.push(new_message);
    this.setState({ messages });
  }

  addMessage = message => {
    const { uid, ticket_id } = this.state;
    this.setMessageInState(message);
    console.log("message", message);
    Firebase.addMessage(uid, ticket_id, message, res => {
      console.log("addedChat", res);
    });
  };
  onType = () => {
    const { uid, ticket_id } = this.state;
    Firebase.setTypeValue(uid, ticket_id, true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      Firebase.setTypeValue(uid, ticket_id, false);
    }, 1000);
  };
  render() {
    const { logo, icon } = this.props;
    const { isIphoneX } = this.state;
    return (
      <div className="message-list-wrapper">
        {this.setMessages()}
        <TransitionGroup component="div" className="message-input-container">
          <MessageInput
            addMessage={this.addMessage}
            isIphoneX={isIphoneX}
            logo={logo}
            onType={this.onType}
          />
        </TransitionGroup>
      </div>
    );
  }
}

export default LiveChat;
