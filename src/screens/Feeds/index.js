import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./index.css";
import { removeAll } from "../../redux/actions";
import Header from "../components/Header";
import AddPost from "./components/AddPost";
import FeedItem from "./components/FeedItem";
import ProfileModal from "../../Components/ProfileModal";
import SubscriptionModal from "../../Components/SubscriptionModal";
import TimelineModal from "../../Components/TimelineModal";
import Firebase from "../../firebasehelper";
class Feeds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      brand_logo: "",
      title: ""
    };
  }
  componentWillReceiveProps(nextProps) {
    const { posts } = nextProps;
    this.setState({ posts: posts ? posts : [] });
    console.log("posts in Feeds", posts);
  }
  componentDidMount() {
    const { uid, profile, brand, posts } = this.props;
    if (!uid) this.props.history.push("/");
    this.setState({ posts: posts ? posts : [] });
    console.log("posts in Feeds", posts);
  }
  showPosts = () => {
    const { posts } = this.state;
    return posts.map((item, index) => {
      return (
        <FeedItem
          avatar_url={item.avatar_url}
          username={item.firstname}
          title={item.title}
          content={item.content}
          poster={item.img_url}
          time={item.time}
          index={index}
        />
      );
    });
  };
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  onChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onAdd = async (image_content, content) => {
    const { title } = this.state;
    const { brand, uid ,profile} = this.props;
    console.log("image", image_content);
    console.log("content", content);
    console.log("title", title);
    // console.log("brand", brand);
    console.log(this.props);
    let folder = "posters/" + brand.name;
    let image_url = await Firebase.uploadImage(image_content, title, folder);

    let firstname= profile.firstname;
    // let avatar_url= "https://img.icons8.com/clouds/2x/user.png";
    let avatar_url= "";

    let post = { title, image_url, uid, content ,firstname ,avatar_url};
    Firebase.addPost(post, brand.name).then(res => {
      console.log("addPost result", res);
    });
  };
  render() {
    const { title } = this.state;
    return (
      <div id="page-container">
        <Header signOut={this.signOut} screen="feeds" />
        <main id="main-container">
          <div className="content">
            <div className="row whatshappenContainer">
              <div className="col-md-12 ">
                <div className="block block-bordered block-rounded">
                  <div className="block-content block-content-full ">
                    <div className="input-group">
                      <input
                        type="text"
                        name="title"
                        className="form-control form-control-alt"
                        placeholder="What’s happening?"
                        onChange={this.onChangeHandler}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-secondary btn-block text-center"
                          type="button"
                          data-toggle="modal"
                          data-target="#post_modal"
                        >
                          <i className="fa fa-pen" />
                          &nbsp;&nbsp;&nbsp; Something on your mind?
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div
                  class="block block-rounded block-bordered"
                  data-toggle="appear"
                > */}
                <div className="feedListResponsive">
                {this.showPosts()}
                </div>

                {/* </div> */}
              </div>
            </div>
          </div>
        </main>
        {title && <AddPost onAdd={this.onAdd} />}
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
    brand: state.brand,
    posts: state.posts
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Feeds));
