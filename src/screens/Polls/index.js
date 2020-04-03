import React from "react";
import { connect } from "react-redux";
import PieChart from "react-minimal-pie-chart";
import "./index.css";
import Firebase from "../../firebasehelper";
import Header from "../components/Header";
import ProfileModal from "../../Components/ProfileModal";
import SubscriptionModal from "../../Components/SubscriptionModal";
import TimelineModal from "../../Components/TimelineModal";
import { removeAll } from "../../redux/actions";
const image = require("../../images/polls/opinion.png");
const day5 = 3600 * 1000 * 24 * 5;
class Polls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      loading: true,
      brand_logo: "",
      poll_data: null,
      option: "option1",
      profile: props.profile,
      polls: []
    };
  }
  async componentDidMount() {
    const { uid, profile, brand } = this.props;
    if (!uid) this.props.history.push("/");
    if(brand){

    if (brand.name !== "Bolt")
      this.unsubscribeProfile = Firebase.firestore()
        .collection(brand.name)
        .doc("data")
        .collection("user")
        .doc(uid)
        .onSnapshot(snapshot => {
          console.log("snapshot", snapshot.data());
          this.setState({ profile: snapshot.data() });
        });
    else if (brand.name === "Bolt")
      this.unsubscribeProfile = Firebase.firestore()
        .collection("user")
        .doc(uid)
        .onSnapshot(snapshot => {
          console.log("snapshot", snapshot.data());
          this.setState({ profile: snapshot.data() });
        });
    let polls_data = await Firebase.getPollsData(brand.name);
    let polls = [];
    polls_data.map(item => {
      let poll_answer = item.poll_answer;
      if (poll_answer) {
        polls.push(poll_answer);
      }
    });
    console.log("polls", polls);
    this.setState({ polls });
    const { poll_data } = brand;
    if (poll_data) {
      this.setState({ poll_data });
    }

    console.log("poll_data", poll_data);
  }

  }
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  onChanged = e => {
    this.setState({ option: e.target.value });
  };
  showPieChart = () => {
    let { polls, profile } = this.state;
    let array = [];
    array["option1"] = 0;
    array["option2"] = 0;
    array["option3"] = 0;
    array["option4"] = 0;
    polls.map(item => {
      array[item.option]++;
    });
    const { poll_answer } = profile;
    let time = poll_answer.time;
    let current_time = new Date().getTime();
    const diff = current_time - time;
    console.log("diff", diff);
    if (diff > day5)
      return (
        <div className="chart-section">
          <div className="pie-section">
            <div className="row_item">
              <div
                style={{ width: 30, height: 30, backgroundColor: "#E38627" }}
              ></div>
              <label>Option1</label>
            </div>
            <div className="row_item">
              <div
                style={{ width: 30, height: 30, backgroundColor: "#A13C37" }}
              ></div>
              <label>Option2</label>
            </div>
            <div className="row_item">
              <div
                style={{ width: 30, height: 30, backgroundColor: "#6A9135" }}
              ></div>
              <label>Option3</label>
            </div>
            <div className="row_item">
              <div
                style={{ width: 30, height: 30, backgroundColor: "#3AF125" }}
              ></div>
              <label>Option4</label>
            </div>
          </div>
          <PieChart
            animate
            animationDuration={500}
            animationEasing="ease-out"
            cx={50}
            cy={50}
            data={[
              {
                color: "#E38627",
                title: "Option1",
                value: array["option1"]
              },
              {
                color: "#A13C37",
                title: "Option2",
                value: array["option2"]
              },
              {
                color: "#6A9135",
                title: "Option3",
                value: array["option3"]
              },
              {
                color: "#3AF125",
                title: "Option4",
                value: array["option4"]
              }
            ]}
            label
            labelPosition={50}
            labelStyle={{
              fill: "#121212",
              fontFamily: "sans-serif",
              fontSize: "5px"
            }}
            lengthAngle={360}
            lineWidth={100}
            onClick={(event, data, dataIndex) => {
              console.log("data", data);
              console.log("dataIndex", dataIndex);
            }}
            onMouseOut={undefined}
            onMouseOver={undefined}
            paddingAngle={0}
            radius={50}
            rounded={false}
            startAngle={0}
            viewBoxSize={[50, 50]}
            style={{ marginTop: 20, height: 450 }}
          />
        </div>
      );
    else
      return (
        <h4>
          Your vote has been submitted... Results are 5 days from release of
          poll at midday GMT.
        </h4>
      );
  };
  submit = () => {
    const { uid, brand } = this.props;
    const { option } = this.state;
    console.log("option", option);
    console.log("brand", brand);
    let time = new Date().getTime();
    Firebase.updateUserData(brand.name, uid, {
      poll_answer: { option: option, time: time }
    });
  };
  showPendingStatus = () => {
    const { profile } = this.state;
  };
  showPollQuestion = () => {
    const { poll_data } = this.state;
    return (
      <div>
        {poll_data && (
          <div id="polls-container">
            <p className="question">{poll_data.question}</p>
            <div
              className="image-area"
              style={{
                backgroundImage: `url(${poll_data.question_img})`
              }}
            ></div>
            <div className="option">
              <input
                type="radio"
                name="option1"
                value={"option1"}
                checked={this.state.option === "option1"}
                onChange={this.onChanged}
              />
              <img src={poll_data.icon1} width="40" alt="icon" />
              <p>{poll_data.answer1}</p>
            </div>
            <div className="option">
              <input
                type="radio"
                name="option2"
                value={"option2"}
                checked={this.state.option === "option2"}
                onChange={this.onChanged}
              />
              <img src={poll_data.icon2} width="40" alt="icon" />
              <p>{poll_data.answer2}</p>
            </div>
            <div className="option">
              <input
                type="radio"
                name="option3"
                value={"option3"}
                checked={this.state.option === "option3"}
                onChange={this.onChanged}
              />
              <img src={poll_data.icon3} width="40" alt="icon" />
              <p>{poll_data.answer3}</p>
            </div>
            <div className="option">
              <input
                type="radio"
                name="option4"
                value={"option4"}
                checked={this.state.option === "option4"}
                onChange={this.onChanged}
              />
              <img src={poll_data.icon4} width="40" alt="icon" />
              <p>{poll_data.answer4}</p>
            </div>
            <button className="btn btn-info" onClick={this.submit}>
              Submit
            </button>
          </div>
        )}
        {!poll_data && (
          <div>
            <div
              style={{
                width: "80%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: 20,
                padding: 40,
                margin: "10%"
              }}
            >
              <img
                src={image}
                width="100"
                height="100"
                alt="support"
                style={{ marginBottom: 20 }}
              />
              <p style={{ textAlign: "center" }}>
                There are currently no active polls. We will notify you when
                there is a live poll. Did you know, you'll earn tokens from
                giving your opinion in our polls?
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  render() {
    const { profile, showResult } = this.state;
    console.log("profile", profile);
    return (
      <div id="page-container">
        <Header signOut={this.signOut} />
        {profile && profile.poll_answer && this.showPieChart()}
        {profile && !profile.poll_answer && this.showPollQuestion()}
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
export default connect(mapStateToProps, mapDispatchToProps)(Polls);
